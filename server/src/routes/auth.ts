import { isEmpty, validate } from "class-validator";
import { Router, Request, Response } from "express";
import User from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

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

    if (isEmpty(email)) errors.email = "이메일은 필수 입력 정보입니다.";
    if (isEmpty(username)) errors.username = "ID는 필수 입력 정보입니다.";
    if (isEmpty(password)) errors.password = "비밀번호는 필수 입력 정보입니다.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // 이메일 및 유저 중복 확인
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 기존 유저와 중복되는 경우
    if (emailUser) errors.email = "이미 해당 주소가 사용되었습니다.";
    if (usernameUser)
      errors.username = "이미 해당 사용자 아이디가 사용되었습니다.";

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

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = "아아디는 비워둘 수 없습니다.";
    if (isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // 디비에서 유저 찾기
    const user = await User.findOneBy({ username });
    if (!user)
      return res.status(404).json({ username: "등록되지 않은 아이디입니다." });

    // 비밀번호 체크
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ password: "비밀번호를 확인해주세요." });
    }

    // token생성
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    // 쿠키 저장
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.post("/register", register);
router.post("/login", login);

export default router;
