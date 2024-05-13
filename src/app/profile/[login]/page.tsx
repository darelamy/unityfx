import { Metadata, NextPage } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import { IPost } from "@/types/Post";
import Link from "next/link";
import styles from "./Profile.module.scss";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { IUser } from "@/types/User";
import { Post } from "@/components/Post";
import { Paginator } from "@/components/Paginator";

async function getData() {
  const user: IUser = {
    id: "123e4567-e89b-12d3-a456-426655440000",
    login: "darelamy",
    avatarUrl:
      "https://s1.1zoom.ru/big7/471/Owls_Birds_Glance_537043_2485x1920.jpg",
    desc: "Всем привет, меня зовут Имя Фамилия, я занимаюсь видеомонтажем с 13 лет. На протяжении 7 лет я монтировала видео в разных программах. Я много чему научилась, но думаю все ещё впереди.",
    followsCount: 2,
    followersCount: 3,
  };

  const posts: IPost[] = [
    {
      id: "123e4567-e89b-12d3-a456-426655440000",
      createdAt: new Date(),
      author: user,
      body:
        "🎬 Очарование в движении: мой новый переход в видео! \n Привет, друзья! Сегодня я хочу поделиться с вами своим последним видео-творением, в котором я реализовал один из самых эффектных переходов, когда-либо созданных мной. Это был захватывающий опыт, и я с нетерпением жду, чтобы поделиться им с вами!\n" +
        "В этом проекте я решил сосредоточиться на плавном и элегантном переходе между двумя кадрами, чтобы создать ощущение непрерывного потока истории. Я использовал комбинацию анимации и цветокоррекции, чтобы сделать переход плавным и красивым.\n" +
        "Невероятно удовлетворительно наблюдать, как каждый элемент видео вливается в следующий, создавая потрясающую гармонию и ритм. Этот проект стал для меня настоящим испытанием моих навыков и вдохновением для творчества.\n" +
        "Я приглашаю вас оценить мой новый переход и поделиться своими мыслями! Дайте мне знать, что вы думаете в комментариях ниже.",
      files: [
        {
          id: "123e4567-e89b-12d3-a456-426655440000",
          fileName: "1.mp4",
          filePath: "/upload/1.mp4",
          fileType: "video/mp4",
        },
        {
          id: "223e4567-e89b-12d3-a456-426655440000",
          fileName: "2.mp4",
          filePath: "/upload/1.mp4",
          fileType: "video/mp4",
        },
        {
          id: "323e4567-e89b-12d3-a456-426655440000",
          fileName: "3.mp4",
          filePath: "/upload/1.mp4",
          fileType: "video/mp4",
        },
        {
          id: "423e4567-e89b-12d3-a456-426655440000",
          fileName: "4.mp4",
          filePath: "/upload/1.mp4",
          fileType: "video/mp4",
        },
        {
          id: "523e4567-e89b-12d3-a456-426655440000",
          fileName: "5.mp4",
          filePath: "/upload/1.mp4",
          fileType: "video/mp4",
        },
        {
          id: "623e4567-e89b-12d3-a456-426655440000",
          fileName: "edit.aep",
          filePath: "/upload/edit.aep",
          fileType: "application/octet-stream",
        },
        {
          id: "723e4567-e89b-12d3-a456-426655440000",
          fileName: "edit.veg",
          filePath: "/upload/edit.veg",
          fileType: "application/octet-stream",
        },
        {
          id: "823e4567-e89b-12d3-a456-426655440000",
          fileName: "edit.prproj",
          filePath: "/upload/edit.prproj",
          fileType: "application/octet-stream",
        },
        {
          id: "923e4567-e89b-12d3-a456-426655440000",
          fileName: "edit.movprj",
          filePath: "/upload/edit.movprj",
          fileType: "application/octet-stream",
        },
        {
          id: "1023e4567-e89b-12d3-a456-426655440000",
          fileName: "edit.drp",
          filePath: "/upload/edit.drp",
          fileType: "application/octet-stream",
        },
      ],
      programs: [
        "adobe after effects",
        "vegas pro",
        "movavi",
        "premiere pro",
        "da vinci resolve",
      ],
      tags: ["видеомонтаж", "творчество", "переходы", "эффекты", "видеопроект"],
      likes: [
        {
          id: "123e4567-e89b-12d3-a456-426655440000",
          postId: "123e4567-e89b-12d3-a456-426655440000",
          author: user,
        },
      ],
      views: [
        {
          id: "123e4567-e89b-12d3-a456-426655440000",
          postId: "123e4567-e89b-12d3-a456-426655440000",
          author: user,
        },
      ],
      comments: [
        {
          id: "123e4567-e89b-12d3-a456-426655440000",
          author: user,
          createdAt: new Date(),
          text: "👏 Просто потрясающе! Я восхищен вашим творчеством и мастерством. Этот переход выглядит так естественно и плавно, словно каждый кадр танцует с другим. Вы действительно создали что-то волшебное! 💫 Жду с нетерпением, чтобы увидеть больше ваших работ!",
          likes: [
            {
              id: "123e4567-e89b-12d3-a456-426655440000",
              postId: "123e4567-e89b-12d3-a456-426655440000",
              commentId: "123e4567-e89b-12d3-a456-426655440000",
              author: user,
            },
          ],
        },
        {
          id: "223e4567-e89b-12d3-a456-426655440000",
          author: user,
          createdAt: new Date(),
          text: "👏 Просто потрясающе! Я восхищен вашим творчеством и мастерством. Этот переход выглядит так естественно и плавно, словно каждый кадр танцует с другим. Вы действительно создали что-то волшебное! 💫 Жду с нетерпением, чтобы увидеть больше ваших работ!",
          likes: [
            {
              id: "123e4567-e89b-12d3-a456-426655440000",
              postId: "123e4567-e89b-12d3-a456-426655440000",
              commentId: "123e4567-e89b-12d3-a456-426655440000",
              author: user,
            },
          ],
        },
      ],
    },
  ];

  return {
    user,
    posts,
    followsCount: user.followsCount,
    followersCount: user.followersCount,
  };
}

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

const ProfilePage: NextPage = async () => {
  const { user, posts, followsCount, followersCount } = await getData();

  return (
    <main>
      <div className={styles.profile}>
        <div className={styles.profileTop}>
          <div className="container">
            <div className="flex items-start">
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
              <div>
                <p className={styles.login}>{user.login}</p>
                <p className={styles.desc}>{user.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center cursor-pointer">
                    <span className={styles.profileStatsItemTitle}>
                      Подписки
                    </span>
                    <span className={styles.profileStatsItemText}>
                      {followsCount}
                    </span>
                  </div>
                  <div className="flex flex-col items-center cursor-pointer">
                    <span className={styles.profileStatsItemTitle}>
                      Подписчики
                    </span>
                    <span className={styles.profileStatsItemText}>
                      {followersCount}
                    </span>
                  </div>
                  <div className="flex flex-col items-center cursor-pointer">
                    <span className={styles.profileStatsItemTitle}>Посты</span>
                    <span className={styles.profileStatsItemText}>
                      {posts.length}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button className={styles.editButton}>
                  Редактировать профиль
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <PageTitle title="Посты">
            <Link href="/create" className={styles.createPostButton}>
              Создать
            </Link>
          </PageTitle>
          <div className={styles.posts}>
            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
          <Paginator totalPosts={5} postsPerPage={1} />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
