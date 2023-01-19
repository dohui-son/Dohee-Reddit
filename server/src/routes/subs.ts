import { Router, Request, Response } from "express";
import User from "../entities/User";
import Sub from "../entities/Sub";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty, validate } from "class-validator";
import { getRepository } from "typeorm";

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(name)) errors.name = "커뮤니티 이름은 비워둘 수 없습니다.";
    if (isEmpty(title)) errors.title = "커뮤니티 주제는 비워둘 수 없습니다.";

    // 커뮤니티 이름 중복 검사 - queryBuilder 사용
    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();
    if (sub) errors.name = "이미 존재하는 커뮤니티 이름입니다.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};
const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
