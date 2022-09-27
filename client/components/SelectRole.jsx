import React, {useState} from "react";
const SelectInput = ({
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
      <div className="flex-1 shrink-0">
        <label
          htmlFor={name}
          className={`block text-sm font-semibold ${
            isFocus ? "text-black dark:text-darkPrimary" : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {label}
        </label>
        <select

          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          type={type || "text"}
          className="mt-2  h-[40px] bg-bgPrimary-700 text-textPrimary w-full  text-sm p-2 rounded-md outline-none"
          placeholder={placeholder}
          name={name}
          id={name}
          onChange={onChange}
          value={value}
        >
            <option className="text-textPrimary" value="customer">Customer</option>
            <option className="text-textPrimary" value="seller">Seller</option>
        </select>
      </div>
    );
  };
  

export default SelectInput;