import React, { useState } from "react";
import "../../../assets/css/auth.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PasswordField from "../shareFiles/PasswordField";
import { api } from "../../../utlis/customAPI";
import { toast } from "react-toastify";
import { formatPlaceholder } from "../../../utlis/formatPlaceholder";
import Loader from "react-js-loader";

const schema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Phone number must be in a valid format")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
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
      .post("/auth/register", data)
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
    <div className="flex items-center auth register">
      <div className="navbar">
        <div className="logo">
          <i></i>
        </div>
      </div>
      <div className="w-full max-w-md p-8 space-y-6 m-auto text-center">
        <h2 className="text-[30px] font-semibold">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {["first_name", "last_name", "email", "phone"].map((field, i) => (
            <div key={i} className="field-group">
              <input
                id={field}
                type={
                  field === "email"
                    ? "email"
                    : field === "phone"
                    ? "tel"
                    : "text"
                }
                placeholder={formatPlaceholder(field)}
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

          {[
            { fieldName: "password", label: "Password" },
            { fieldName: "confirm_password", label: "Confirm Password" },
          ].map((item, i) => (
            <div key={i} className="field-group">
              <PasswordField
                fieldName={item.fieldName}
                label={item.label}
                register={register}
                error={errors[item.fieldName]?.message}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-4 bg-[#D9D9D9] rounded-[10px] hover:bg-[#c7c5c5] transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader type="bubble-spin" bgColor="#000" size={30} />
            ) : (
              "Create"
            )}
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account ?{" "}
          <Link to="/login" className="hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
