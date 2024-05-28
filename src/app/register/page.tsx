import { Metadata, NextPage } from "next";
import React from "react";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация",
  icons: {
    icon: "/favicons/auth-page.svg",
  },
};

const RegisterPage: NextPage = () => {
  return (
    <main className="mb-10">
      <div className="container flex justify-center">
        <RegisterForm />
      </div>
    </main>
  );
};

export default RegisterPage;
