import React, {useState} from "react";
const InputField = ({
    label,
    type,
    placeholder,
    name,
    onChange,
    value,
    width,
  }) => {
    const [isFocus, setIsFocus] = useState(false);
    return (
      <div className="flex-1 shrink-0 w-full">
        <label
          htmlFor={name}
          className={`block text-sm font-semibold ${
            isFocus ? "text-black dark:text-darkPrimary" : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {label}
        </label>
        <input

          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          type={type || "text"}
          className="mt-1 h-[30px] bg-transparent border-b-[1px] border-gray-400 focus:border-black  placeholder:text-gray-600  w-full text-textPrimary  text-sm p-2 rounded-sm outline-none"
          placeholder={placeholder}
          name={name}
          id={name}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  };
  

export default InputField;