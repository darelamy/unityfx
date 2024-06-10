import { Metadata } from "next";
import React from "react";
import { PageTitle } from "@/components/PageTitle";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import { IPost } from "@/types/Post";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";
import { Posts } from "@/components/Posts";

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  return {
    title: `Посты по тегу #${decodeURIComponent(params.tag)}`,
    icons: {
      icon: "/favicons/posts-page.svg",
    },
  };
}

async function getPosts(tag: string) {
  const { data } = await axios.get(`${apiUrl}/api/posts/tags`, {
    params: { tag },
  });

  return data as IPost[];
}

const Tag = async ({ params }: { params: { tag: string } }) => {
  const session = await getServerSession(authOptions);
  const authUser = session?.user;
  const posts = await getPosts(decodeURIComponent(params.tag));

  return (
    <main className="mb-10 dashed">
      <div className="container">
        <PageTitle title={`Тег #${decodeURIComponent(params.tag)}`} />
        <Posts posts={posts} authUser={authUser} />
      </div>
    </main>
  );
};

export default Tag;
