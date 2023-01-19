import { validate } from "class-validator";
import { Router, Request, Response } from "express";
import User from "../entities/User";

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    // 이메일 및 유저 중복 확인
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 기존 유저와 중복되는 경우
    if (emailUser) errors.email = "이미 해당 주소가 사용되었습니다.";
    if (usernameUser)
      errors.username = "이미 해당 사용자 닉네임이 사용되었습니다.";

    // 에러가 존재하는 경우, 에러를 response 보내줌.
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 유효성 검사 - entity의 조건에 따라 체크
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    // 유저 정보 user table에 저장
    await user.save();

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const router = Router();
router.post("/register", register);

export default router;
