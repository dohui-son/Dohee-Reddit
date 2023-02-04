import React from "react";
import "./bottom-sheet.module.scss";

type TutorialProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

const Tutorial = ({ isOpen, setIsOpen }: TutorialProps) => {
  console.log(isOpen);

  return <div>{isOpen && <div className="tutorial-layout">hi</div>}</div>;
};

export default Tutorial;
