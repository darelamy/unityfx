import { Metadata, NextPage } from "next";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import Editor from "@/components/Editor";
import { PageTitle } from "@/components/PageTitle";
import styles from "./Create.module.scss";
import { AttachIcon } from "@/icons/AttachIcon";
import ProgramSelector from "@/components/ProgramSelector";
import { tuple } from "ts-interface-checker";
import { TagSelector } from "@/components/TagSelector";
import { CreateForm } from "@/components/CreateForm";

export const metadata: Metadata = {
  title: "Создание поста",
  icons: {
    icon: "/favicons/create-page.svg",
  },
};

const CreatePage: NextPage = () => {
  return (
    <main className={styles.main}>
      <div className="container">
        <PageTitle title="Создание поста" />
        <CreateForm />
      </div>
    </main>
  );
};

export default CreatePage;
