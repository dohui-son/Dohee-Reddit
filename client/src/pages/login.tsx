import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import Link from "next/link";
import InputGroup from "../components/InputGroup";
import { useAuthDispatch, useAuthState } from "../context/auth";

const Login = () => {
  let router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  if (authenticated) router.push("/"); // 이미 로그인한 상태면 메인으로 이동

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post("/auth/login", {
        password,
        username,
      });

      dispatch("LOGIN", res.data?.user);

      router.push("/");
    } catch (error: any) {
      console.log(error);
      setErrors(error?.response?.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:d-96">
          <h1 className="mb-2 text-lg font-medium">👥 로그인</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 bordder border-gray-400 rounded">
              로그인
            </button>
          </form>
          <small>
            1초만에 회원가입!!!
            <Link className="ml-2 text-blue-500 uppercase" href="/register">
              회원가입
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
