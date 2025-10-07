import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordField = ({ fieldName, label, register, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="field-group">
            <div className="relative">
                <input
                    id={fieldName}
                    type={showPassword ? "text" : "password"}
                    placeholder={label?.replace("_", " ")}
                    {...register(fieldName)}
                    className={`w-full py-4 pl-4 pr-7 rounded-[10px] outline-none bg-transparent input-b ${error ? "border-red-500" : ""
                        }`}
                />
                <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[12px] bottom-[20px] cursor-pointer"
                >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </span>

            </div>
            {error && (
                <p className="text-red-500 text-[14px] mt-1 ml-4 text-left">{error}</p>
            )}
        </div>
    );
};

export default PasswordField;
