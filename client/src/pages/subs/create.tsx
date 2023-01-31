import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import InputGroup from "../../components/InputGroup";
import Image from "next/image";
import Slogo from "../../assets/lounge_sq_b.png";

const SubCreate = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<any>({});

  let router = useRouter();

  //Todo: create subs failed with Status 500
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post("/subs", { name, title, description });

      router.push(`/r/${res.data.name}`);
      alert(`${name} 라운지를 생성했습니다.`); //Todo: 이 임시 alert 삭제
    } catch (error: any) {
      console.log("CREATE ERROR", error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <div className="flex justify-center">
          {" "}
          <Image
            src={Slogo}
            alt="logo"
            width={90}
            height={90}
            className="mb-10"
          />
        </div>

        <h1 className="mb-2 text-lg font-medium">👨‍👩‍👧‍👧 라운지 만들기</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="font-medium">Community Name</p>
            <p className="mb-2 text-xs text-gray-400">
              라운지 이름은 수정이 불가능합니다. 다른 항목은 수정 가능합니다.
            </p>
            <InputGroup
              placeholder="Community Name"
              value={name}
              setValue={setName}
              error={errors.name}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Topic</p>
            <p className="mb-2 text-xs text-gray-400">
              라운지의 주제를 작성해주세요.
            </p>
            <InputGroup
              placeholder="Topic"
              value={title}
              setValue={setTitle}
              error={errors.title}
            />
          </div>
          <div className="my-6">
            <p className="font-medium">Description</p>
            <p className="mb-2 text-xs text-gray-400">라운지를 소개해주세요.</p>
            <InputGroup
              placeholder="Description"
              value={description}
              setValue={setDescription}
              error={errors.description}
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 text-sm font-semibold rounded text-white bg-mint border hover:bg-pblue">
              라운지 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");

    await axios.get("/auth/me", { headers: { cookie } });
    return { props: {} };

    // 백엔드에서 받은 쿠키로 인증 처리시 에러가 나면 login 페이지로 이동
  } catch (error) {
    console.log(error);
    res.writeHead(307, { Location: "/login" }).end(); // HTTP 307 : Temporary Redirect
    return { props: {} };
  }
};
