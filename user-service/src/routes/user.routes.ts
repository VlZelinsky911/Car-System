import { Router } from "express";
import { createUser, listUsers, getUser, updateUser, deleteUser } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.post("/users", createUser);
userRouter.get("/users", listUsers);
userRouter.get("/users/:id", getUser);
userRouter.patch("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);
