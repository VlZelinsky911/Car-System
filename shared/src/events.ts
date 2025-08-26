export type UserCreatedEvent = {
  type: "USER_CREATED";
  data: { id: number; email: string };
};