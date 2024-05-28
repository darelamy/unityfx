import { Metadata, NextPage } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import { CreateForm } from "@/components/CreateForm";

export const metadata: Metadata = {
  title: "Создание поста",
  icons: {
    icon: "/favicons/create-page.svg",
  },
};

const CreatePage: NextPage = () => {
  return (
    <main className="dashed">
      <div className="container">
        <PageTitle title="Создание поста" />
        <CreateForm />
      </div>
    </main>
  );
};

export default CreatePage;
