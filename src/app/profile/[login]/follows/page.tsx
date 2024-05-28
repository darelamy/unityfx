import { Metadata } from "next";
import React from "react";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import { IUser } from "@/types/User";
import { FollowButton } from "@/components/FollowButton";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";

import styles from "../Profile.module.scss";
import { PageTitle } from "@/components/PageTitle";
import Link from "next/link";

const getData = async (login: string) => {
  const { data } = await axios.get(`${apiUrl}/api/users/${login}/follows`);

  return { follows: data };
};

interface Props {
  params: { id: string; login: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Подписки ${params.login}`,
    icons: {
      icon: "/favicons/profile-page.svg",
    },
  };
}

const UserFollowsPage = async ({ params }: { params: { login: string } }) => {
  const { follows }: { follows: IUser[] } = await getData(params.login);

  const session = await getServerSession(authOptions);
  const authUser = session?.user;

  const isAuth = !!authUser;

  return (
    <main className="mb-10">
      <div className="container">
        <PageTitle title="Подписки" />
        <div className="flex flex-col gap-10">
          {follows.map((follow) => (
            <div
              key={follow.id}
              className={`${styles.followPageItem} flex items-center justify-between`}
            >
              <Link href={`/@${follow.login}`} className="flex items-center">
                <div className={styles.followPageAvatar}>
                  {follow.avatarUrl ? (
                    <img src={follow.avatarUrl} alt="avatar" />
                  ) : (
                    <DefaultAvatar />
                  )}
                </div>
                <span className={styles.followPageLogin}>{follow.login}</span>
              </Link>
              {isAuth && (
                <FollowButton
                  user={follow}
                  authUser={authUser}
                  isUserFollowed={follow.followedByIDs?.some(
                    (id) => id === authUser?.id
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default UserFollowsPage;
