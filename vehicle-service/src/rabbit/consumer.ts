import * as amqp from "amqplib";
import { prisma } from "../db/prisma";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";
const QUEUE = process.env.USER_CREATED_QUEUE || "user.created";
const EXCHANGE = process.env.USER_EVENTS_EXCHANGE; 
const ROUTING_KEY = process.env.USER_CREATED_RK || "USER_CREATED";

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

type UserCreatedEvent = {
  type: "USER_CREATED";
  data: { id: number; email?: string };
  eventId?: string;
};

function parseEvent(buf: Buffer): UserCreatedEvent | null {
  try {
    const p = JSON.parse(buf.toString());
    if (p?.type === "USER_CREATED" && typeof p?.data?.id === "number") return p;
  } catch {}
  return null;
}

async function handleUserCreated(evt: UserCreatedEvent) {
  const userId = evt.data.id;
  await prisma.vehicle.upsert({
    where: { userId_placeholder: { userId, placeholder: true } },
    update: {},
    create: { userId, make: "Unknown", model: "Unknown", year: null, placeholder: true },
  });
}

async function setupChannel(conn: amqp.Connection): Promise<amqp.Channel> {
  const ch = await (conn as any).createChannel();
  await ch.prefetch(10);

  if (EXCHANGE) {
    await ch.assertExchange(EXCHANGE, "topic", { durable: true });
    await ch.assertQueue(QUEUE, { durable: true });
    await ch.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
  } else {
    await ch.assertQueue(QUEUE, { durable: true });
  }

  await ch.consume(QUEUE, async (msg: amqp.ConsumeMessage | null) => {
    if (!msg) return;
    const evt = parseEvent(msg.content);
    if (!evt) {
      console.warn("[vehicle-consumer] skip invalid message:", msg.content.toString());
      ch.ack(msg);
      return;
    }
    try {
      await handleUserCreated(evt);
      ch.ack(msg);
      console.log(`[vehicle-consumer] USER_CREATED processed for userId=${evt.data.id}`);
    } catch (e: any) {
      console.error("[vehicle-consumer] process failed:", e);
      ch.nack(msg, false, false);
    }
  });

  console.log(
    `[vehicle-consumer] consuming from queue="${QUEUE}"` +
      (EXCHANGE ? ` (exchange="${EXCHANGE}", rk="${ROUTING_KEY}")` : "")
  );

  return ch;
}

async function connectAndConsume(): Promise<void> {
  const RECONNECT_MS = 3000;
  try {
    connection = await amqp.connect(RABBITMQ_URL) as any;
    if (connection) {
      connection.on("close", () => {
        console.error("[vehicle-consumer] connection closed, reconnect...");
        connection = null;
        channel = null;
        setTimeout(() => void connectAndConsume(), RECONNECT_MS);
      });
      connection.on("error", (e: any) => console.error("[vehicle-consumer] connection error:", e));
      channel = await setupChannel(connection);
    } else {
      throw new Error("connection is null");
    }
  } catch (e: any) {
    console.error("[vehicle-consumer] connect failed, retrying...", e);
    setTimeout(() => void connectAndConsume(), RECONNECT_MS);
  }
}

export function startUserCreatedConsumer() {
  if (!RABBITMQ_URL) {
    console.warn("[vehicle-consumer] RABBITMQ_URL not set — skipping consumer");
    return;
  }
  void connectAndConsume();
}

export async function stopUserCreatedConsumer() {
  try { await channel?.close(); } catch {}
  try { await (connection as any)?.close(); } catch {}
}
