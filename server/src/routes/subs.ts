import { Router, Request, Response } from "express";
import User from "../entities/User";
import Sub from "../entities/Sub";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty, validate } from "class-validator";
import { UpdateQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(name)) errors.name = "커뮤니티 이름은 비워둘 수 없습니다.";
    if (isEmpty(title)) errors.title = "커뮤니티 주제는 비워둘 수 없습니다.";

    // 커뮤니티 이름 중복 검사 - queryBuilder 사용
    const sub = await AppDataSource.getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();
    if (sub) errors.name = "이미 존재하는 커뮤니티 이름입니다.";

    if (Object.keys(errors).length > 0) throw errors;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }

  try {
    const user: User = res.locals.user;

    // sub(커뮤니티) instance 생성 및 bd에 저장
    const sub = new Sub();
    sub.name = name;
    sub.description = description;
    sub.user = user;
    await sub.save();

    return res.json(sub); // 완료후 fe로 전달
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};
const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
