import { Metadata, NextPage } from "next";
import React from "react";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";
import { PageContent } from "@/src/app/posts/PageContent";

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
      <PageContent authUser={authUser} />
    </main>
  );
};

export default PostsPage;
