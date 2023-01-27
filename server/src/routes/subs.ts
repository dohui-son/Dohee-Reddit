import { Router, Request, Response, NextFunction } from "express";
import User from "../entities/User";
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty, validate } from "class-validator";
import { UpdateQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneByOrFail({ name });

    // const posts = await Post.find({
    //   where: { sub },
    //   order: { createdAt: "DESC" },
    //   relations: ["comments", "votes"],
    // });

    // sub.posts = posts;
    // if (res.locals.user) {
    //   sub.posts.forEach((p) => p.setUserVote(res.locals.user));
    // }

    return res.json(sub);
  } catch (error) {
    return res.status(404).json({ error: "커뮤니티를 찾을 수 없습니다." });
  }
};

const createSub = async (req: Request, res: Response) => {
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

    // sub(커뮤니티) instance 생성 및 db에 저장
    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    await sub.save();

    return res.json(sub); // 완료후 fe로 전달
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const topSubs = async (_: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE(s."imageUrn", 'https://www.gravatar.com/avatar?d=mp&f=y')`;
    const subs = await AppDataSource.createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went Wrong." });
  }
};

//about: Banner of Profile Image
const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

    if (sub.username !== user.username) {
      return res
        .status(403)
        .json({ error: "해당 커뮤니티를 소유하고 있지 않습니다." });
    }
    res.locals.sub = sub;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const router = Router();

router.get("/:name", userMiddleware, getSub);
router.post("/", userMiddleware, authMiddleware, createSub);
router.get("/sub/topSubs", topSubs);
//about: Banner of Profile Image
// router.post(
//   "/:name/upload",
//   userMiddleware,
//   authMiddleware,
//   ownSub,
//   upload.single("file"),
//   uploadSubImage
// );

export default router;
