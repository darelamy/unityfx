import { Metadata, NextPage } from "next";
import React from "react";
import { PageContent } from "@/src/app/confirmation/PageContent";

export const metadata: Metadata = {
  title: "Подтверждение почты",
  icons: {
    icon: "/favicons/auth-page.svg",
  },
};

const ConfirmationPage: NextPage = () => {
  return (
    <main className="mb-10">
      <PageContent />
    </main>
  );
};

export default ConfirmationPage;
