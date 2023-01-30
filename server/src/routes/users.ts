import { Router, Request, Response } from "express";
import Post from "../entities/Post";
import User from "../entities/User";
import Comment from "../entities/Comment";
import userMiddleware from "../middlewares/user";

const getUserData = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ["username", "createdAt"],
    });

    //NOTE: 유저가 작성한 포스트
    const posts = await Post.find({
      where: { username: user.username },
      relations: ["comments", "votes", "sub"],
    });

    //NOTE: 유저가 작성한 comment(댓글)
    const comments = await Comment.find({
      where: { username: user.username },
      relations: ["post"],
    });

    if (res.locals.user) {
      const { user } = res.locals;
      posts.forEach((p) => p.setUserVote(user));
      comments.forEach((c) => c.setUserVote(user));
    }

    let userData: any[] = [];
    posts.forEach((p) => userData.push({ type: "Post", ...p.toJSON() })); // spread operator로 새로운 객체로 복사할때 인스턴스 상태로 하면 @Expose를 이용한 getter로는 들어가지 않음! 따라서 객체로 바꿔서 복사 진행
    comments.forEach((c) => userData.push({ type: "Comment", ...c.toJSON() }));
    // 정보 최신순 정렬
    userData.sort((a, b) => {
      if (b.createdAt > a.createdAt) return 1;
      if (b.createdAt < a.createdAt) return -1;
      return 0;
    });

    return res.json({ user, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "사용자 정보를 불러올 수 없습니다." });
  }
};

const router = Router();
router.get("/:username", userMiddleware, getUserData);

export default router;
