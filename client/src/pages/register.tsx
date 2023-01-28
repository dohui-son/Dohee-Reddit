import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

import InputGroup from "../components/InputGroup";
import { useAuthState } from "../context/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({}); // any type 추가

  let router = useRouter();
  const { authenticated } = useAuthState();

  if (authenticated) router.push("/");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // onSubmit 이벤트가 일어났을때 refrsh 되는것 방지

    try {
      const res = await axios.post("/auth/register", {
        email,
        password,
        username,
      });

      router.push("/login");
    } catch (error: any) {
      console.log(error);
      setErrors(error?.response?.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:d-96">
          <h1 className="mb-2 text-lg font-medium">📋 회원가입</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
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
              회원가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link className="ml-2 text-blue-500 uppercase" href="/login">
              로그인
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
