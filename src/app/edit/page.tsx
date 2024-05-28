import { Metadata, NextPage } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import { EditProfileForm } from "@/components/EditProfileForm";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";

export const metadata: Metadata = {
  title: "Редактирование профиля",
  icons: {
    icon: "/favicons/edit-profile-page.svg",
  },
};

const EditProfilePage: NextPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <main className="dashed">
      <div className="container">
        <PageTitle title="Редактирование профиля" />
        <EditProfileForm user={session?.user} />
      </div>
    </main>
  );
};

export default EditProfilePage;
