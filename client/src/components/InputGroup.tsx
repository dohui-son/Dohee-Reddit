import React from "react";
import cls from "classnames";

interface InputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string;
  setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className = "mb-2",
  type = "text",
  placeholder = "",
  error = "",
  value,
  setValue,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        style={{ minWidth: 300 }}
        className={cls(
          `w-full p-3 transition duration-200 border border-gray-200 rounded bg-gray-50 focus:bg-white hover:bg-white`,
          { "border-red-500": error }
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value.trim())}
      />
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
};

export default InputGroup;
