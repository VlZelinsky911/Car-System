// user-service/src/rabbit/publisher.ts
import * as amqp from "amqplib";

export async function publishUserCreated(url: string, evt: { type: "USER_CREATED"; data: { id: number; email?: string } }) {
  const queue = process.env.USER_CREATED_QUEUE || "user.created";
  const conn = await amqp.connect(url);
  const ch = await conn.createChannel();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(evt)), { persistent: true });
  await ch.close();
  await conn.close();
}
