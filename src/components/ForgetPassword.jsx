"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/navigation";

function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState("emailInput");
  const [userEmail, setUserEmail] = useState("");

  const validationSchemaEmail = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const validationSchemaReset = yup.object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const formikEmail = useFormik({
    initialValues: { email: "" },
    validationSchema: validationSchemaEmail,
    onSubmit: async (values) => {
      const response = await fetch("/api/auth/user-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      if (response.ok) {
        setUserEmail(values.email);
        setStep("resetForm");
      } else {
        formikEmail.setErrors({ email: data.message });
      }
    },
  });

  const formikReset = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchemaReset,
    onSubmit: async (values) => {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: values.password }),
      });
      if (response.ok) {
        alert("Password has been reset successfully.");
        setStep("emailInput");
        formikReset.resetForm();
        router.push("/login");
      } else {
        const errorData = await response.json();
        formikReset.setErrors({ submit: errorData.message });
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        {step === "emailInput" && (
          <form onSubmit={formikEmail.handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              onChange={formikEmail.handleChange}
              value={formikEmail.values.email}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Send Reset Link
            </Button>
            {formikEmail.errors.email && (
              <div className="text-red-500 text-sm">
                {formikEmail.errors.email}
              </div>
            )}
          </form>
        )}

        {step === "resetForm" && (
          <form onSubmit={formikReset.handleSubmit} className="space-y-4">
            <Input
              id="password"
              name="password"
              type="password"
              onChange={formikReset.handleChange}
              value={formikReset.values.password}
              placeholder="New password"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formikReset.handleChange}
              value={formikReset.values.confirmPassword}
              placeholder="Confirm password"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Change Password
            </Button>
            {formikReset.errors.submit && (
              <div className="text-red-500 text-sm">
                {formikReset.errors.submit}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
