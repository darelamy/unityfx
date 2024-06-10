import { Metadata } from "next";
import React from "react";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import { IUser } from "@/types/User";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";
import { PageTitle } from "@/components/PageTitle";
import { UsersList } from "@/components/UsersList";

const getData = async (login: string) => {
  const { data } = await axios.get(`${apiUrl}/api/users/${login}/followers`);

  return { followers: data };
};

interface Props {
  params: { id: string; login: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Подписчики ${params.login}`,
    icons: {
      icon: "/favicons/profile-page.svg",
    },
  };
}

const UserFollowersPage = async ({ params }: { params: { login: string } }) => {
  const { followers }: { followers: IUser[] } = await getData(params.login);

  const session = await getServerSession(authOptions);
  const authUser = session?.user;

  return (
    <main className="mb-10">
      <div className="container">
        <PageTitle title="Подписчики" />
        <UsersList users={followers} authUser={authUser} />
      </div>
    </main>
  );
};

export default UserFollowersPage;
