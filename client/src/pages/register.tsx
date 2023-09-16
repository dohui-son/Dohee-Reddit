import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import InputGroup from '../components/InputGroup';
import { useAuthState } from '../context/auth';
import Logo from '../assets/lounge_bl.png';
import { emailRegex, passwordRegex } from '@lib/validation/regex';

const Register = () => {
  const [email, setEmail] = useState('');
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email: string;
    userName: string;
    password: string;
  }>({ email: '', userName: '', password: '' }); // any type 추가

  let router = useRouter();
  const { authenticated } = useAuthState();

  if (authenticated) router.push('/');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // onSubmit 이벤트가 일어났을때 refrsh 되는것 방지

    try {
      const res = await axios.post('/auth/register', {
        email,
        password,
        userName,
      });

      router.push('/login');
    } catch (error: any) {
      console.log(error);
      setErrors(error?.response?.data || {});
    }
  };

  useEffect(() => {
    const validationTimer = setTimeout(() => {
      setErrors({
        email: emailRegex.test(email) ? '이메일 형식을 확인해주세요.' : '',
        userName: '',
        password: passwordRegex.test(password)
          ? '비밀번호는 특수문자, 대문자, 소문자, 숫자를 포함해야합니다'
          : '',
      });
    }, 3000);
    clearTimeout(validationTimer);
  }, [email, userName, password]);

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <Image
          src={Logo}
          width={200}
          height={200}
          alt="logo"
          className="m-10 cursor-pointer"
          onClick={() => {
            router.push('/');
          }}
        />
        <div className="w-4/12 mx-auto md:d-96">
          <h1 className="mb-2 text-lg font-medium">📋 회원가입</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
            <InputGroup
              placeholder="userName"
              value={userName}
              setValue={setuserName}
              error={errors.userName}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bordder rounded bg-mint hover:bg-pblue">
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
