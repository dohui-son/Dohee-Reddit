import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import InputGroup from "../../components/InputGroup";

const SubCreate = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [decription, setDescription] = useState("");
  const [errors, setErrors] = useState<any>({});

  let router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post("/subs", { name, title, decription });

      router.push(`/r/${res.data.name}`);
    } catch (error: any) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <h1 className="mb-2 text-lg font-medium">커뮤니티 만들기</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="font-medium">Community Name</p>
            <p className="mb-2 text-xs text-gray-400">
              커뮤니티 이름은 수정이 불가능합니다.
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
              커뮤니티의 주제를 작성해주세요. 수정 가능합니다.
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
            <p className="mb-2 text-xs text-gray-400">
              커뮤니티에 대한 설명을 작성해주세요.
            </p>
            <InputGroup
              placeholder="Description"
              value={decription}
              setValue={setDescription}
              error={errors.description}
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 text-sm font-semibold rounded text-white bg-gray-400 border">
              커뮤니티 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;
