import { Metadata } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import Link from "next/link";
import styles from "./Profile.module.scss";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import { IUser } from "@/types/User";
import { IPost } from "@/types/Post";
import authOptions from "@/utils/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FollowButton } from "@/components/FollowButton";
import { PostsBlock } from "@/components/PostsBlock";

const getData = async (login: string) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/users/${login}`);

    return { user: data.user, posts: data.posts, total: data.total };
  } catch (err) {
    notFound();
  }
};

interface Props {
  params: { id: string; login: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.login,
    icons: {
      icon: "/favicons/profile-page.svg",
    },
  };
}

const ProfilePage = async ({ params }: { params: { login: string } }) => {
  const { user, posts, total }: { user: IUser; posts: IPost[]; total: number } =
    await getData(params.login);
  const session = await getServerSession(authOptions);
  const authUser = session?.user;

  const isOwner = authUser?.login === user.login;

  return (
    <main>
      <div
        className={styles.profile}
        style={{
          borderBottom: posts.length === 0 ? "none" : "3px dashed #c4c4c4",
        }}
      >
        <div className={styles.profileTop}>
          <div className="container">
            <div className="flex items-start justify-center flex-wrap gap-5">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatar}>
                  <DefaultAvatar />
                </div>
              )}
              <div className="flex-1">
                <p className={styles.login}>{user.login}</p>
                <p className={styles.desc}>{user.desc}</p>
                <div className="flex items-center justify-between gap-5">
                  <Link
                    href={`/@${user.login}/follows`}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <span className={styles.profileStatsItemTitle}>
                      Подписки
                    </span>
                    <span className={styles.profileStatsItemText}>
                      {user.followsCount}
                    </span>
                  </Link>
                  <Link
                    href={`/@${user.login}/followers`}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <span className={styles.profileStatsItemTitle}>
                      Подписчики
                    </span>
                    <span className={styles.profileStatsItemText}>
                      {user.followersCount}
                    </span>
                  </Link>
                  <div className="flex flex-col items-center cursor-pointer">
                    <span className={styles.profileStatsItemTitle}>Посты</span>
                    <span className={styles.profileStatsItemText}>{total}</span>
                  </div>
                </div>
              </div>
              {authUser && (
                <>
                  {isOwner ? (
                    <Link href="/edit" className={styles.editButton}>
                      <span>Редактировать профиль</span>
                    </Link>
                  ) : (
                    <FollowButton
                      user={user}
                      authUser={authUser}
                      isUserFollowed={user.followedByIDs?.some(
                        (id) => id === authUser?.id
                      )}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="container">
          <PageTitle title="Посты">
            {isOwner && (
              <Link href="/create" className={styles.createPostButton}>
                Создать
              </Link>
            )}
          </PageTitle>
          <PostsBlock authUser={authUser} type="profile" login={user.login} />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
