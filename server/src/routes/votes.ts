import { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import Post from "../entities/Post";
import User from "../entities/User";
import Comment from "../entities/Comment";
import Vote from "../entities/Vote";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  // 값 검증
  if (![-1, 0, 1].includes(value)) {
    return res
      .status(400)
      .json({ vlaue: "value는 -1, 0 or 1 이어야만 합니다." });
  }

  try {
    const user: User = res.locals.user;
    let post: Post | undefined = await Post.findOneByOrFail({
      identifier,
      slug,
    });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    // 댓글 식별자가 있는 경우 (댓글로 vote 찾기) / 식별자가 없는 경우 (포스트로 vote 찾기)
    if (commentIdentifier) {
      comment = await Comment.findOneByOrFail({
        identifier: commentIdentifier,
      });
      vote = await Vote.findOneBy({
        username: user.username,
        commentId: comment.id,
      });
    } else {
      vote = await Vote.findOneBy({ username: user.username, postId: post.id });
    }

    if (!vote && value === 0) {
      // vote이 없고 value가 0인 경우
      return res.status(404).json({ error: "Vote을 찾을 수 없습니다." });
    } else if (!vote) {
      vote = new Vote();
      vote.user = user;
      vote.value = value;

      if (comment) vote.comment = comment;
      else vote.post = post;

      await vote.save();
    } else if (value === 0) {
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail({
      where: { identifier, slug },
      relations: ["comments", "comments.votes", "sub", "votes"],
    });

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    console.log("\n comment -> post");
    console.log(comment);
    console.log(post);
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "댓글 정보 업로드중 문제가 발생했습니다." });
  }
};

const router = Router();
router.post("/", userMiddleware, authMiddleware, vote);
export default router;
