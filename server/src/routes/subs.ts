import { Router, Request, Response } from "express";
import User from "../entities/User";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;
};
const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
