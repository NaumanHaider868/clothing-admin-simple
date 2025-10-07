import React, { useState } from "react";
import "../../../assets/css/auth.scss";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../utlis/customAPI";
import { toast } from "react-toastify";
import PasswordField from "../shareFiles/PasswordField";
import Loader from "react-js-loader";

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    setLoading(true);
    api
      .post("/auth/login", data)
      .then((res) => {
        toast.success(res.data.message);
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center auth login">
      <div className="navbar">
        <div className="logo">
          <i></i>
        </div>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 m-auto text-center">
        <h2 className="text-[30px] font-semibold">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {["email"].map((field, i) => (
            <div key={i}>
              <input
                id={field}
                type={field === "email" ? "email" : "text"}
                placeholder={errors[field] ? errors[field].message : field}
                {...register(field)}
                className={`w-full py-4 pl-4 pr-7 rounded-[10px] outline-none bg-transparent input-b ${
                  errors[field] ? "border-red-500" : ""
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-[14px] mt-1 ml-4 text-left">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}

          {/* Password Field */}
          <PasswordField
            fieldName="password"
            label="Password"
            register={register}
            error={errors.password?.message}
          />

          <button
            type="submit"
            className="w-full py-4 bg-[#D9D9D9] rounded-[10px] hover:bg-[#c7c5c5] transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader type="bubble-spin" bgColor="#000" size={30} />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-sm text-center">
          Don't have an account ?{" "}
          <Link to="/register" className="hover:underline cursor-pointer">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
