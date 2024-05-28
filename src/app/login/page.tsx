import { Metadata, NextPage } from "next";
import React from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Авторизация",
  icons: {
    icon: "/favicons/auth-page.svg",
  },
};

const LoginPage: NextPage = () => {
  return (
    <main className="mb-10">
      <div className="container flex justify-center">
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
