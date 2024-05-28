import { Metadata, NextPage } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";
import { PostsBlock } from "@/components/PostsBlock";

export const metadata: Metadata = {
  title: "Посты",
  icons: {
    icon: "/favicons/posts-page.svg",
  },
};

const PostsPage: NextPage = async () => {
  const session = await getServerSession(authOptions);
  const authUser = session?.user;

  return (
    <main className="mb-10 dashed">
      <div className="container">
        <PageTitle title="Посты" />
        <PostsBlock authUser={authUser} />
      </div>
    </main>
  );
};

export default PostsPage;
