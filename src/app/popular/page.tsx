import { Metadata, NextPage } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";
import { PostsBlock } from "@/components/PostsBlock";

export const metadata: Metadata = {
  title: "Популярные посты",
  icons: {
    icon: "/favicons/popular-posts-page.svg",
  },
};

const PopularPostsPage: NextPage = async () => {
  const session = await getServerSession(authOptions);
  const authUser = session?.user;

  return (
    <main className="mb-10 dashed">
      <div className="container">
        <PageTitle title="Популярные посты" />
        <PostsBlock authUser={authUser} type="popular" />
      </div>
    </main>
  );
};

export default PopularPostsPage;
