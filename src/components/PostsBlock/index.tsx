"use client";

import { Paginator } from "@/components/Paginator";
import React from "react";
import { IUser } from "@/types/User";
import { IPost } from "@/types/Post";
import { apiUrl } from "@/src/app/api/apiUrl";
import axios from "axios";
import { Posts } from "@/components/Posts";

interface PostsBlockProps {
  authUser?: IUser;
  type?: string;
  login?: string;
}

export const PostsBlock: React.FC<PostsBlockProps> = ({
  authUser,
  type,
  login,
}) => {
  const [currentPosts, setCurrentPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPosts, setTotalPosts] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const postsPerPage = 5;

  const getFollowingPosts = async (page: number, postsPerPage: number) => {
    const { data } = await axios.get(`${apiUrl}/api/users/${authUser?.login}`);

    const followingUserIds = (data.user as IUser)?.followingIDs;

    if (!followingUserIds || followingUserIds.length === 0)
      return { posts: [], total: 0 };

    const followingPosts = await axios.get<{
      posts: IPost[];
      total: number;
    }>(`${apiUrl}/api/posts/following?page=${page}&limit=${postsPerPage}`);

    return followingPosts.data;
  };

  const getAllPosts = async (page: number, postsPerPage: number) => {
    const allPosts = await axios.get<{
      posts: IPost[];
      total: number;
    }>(`${apiUrl}/api/posts?page=${page}&limit=${postsPerPage}`);
    return allPosts.data;
  };

  const getPosts = async (page: number, postsPerPage: number) => {
    try {
      setIsLoading(true);

      if (type === "profile") {
        const { data } = await axios.get<{
          user: IUser;
          posts: IPost[];
          total: number;
        }>(`${apiUrl}/api/users/${login}?page=${page}&limit=${postsPerPage}`);
        return data;
      } else if (type === "following") {
        return await getFollowingPosts(page, postsPerPage);
      } else {
        return await getAllPosts(page, postsPerPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDeletePost = (postId: string) => {
    setCurrentPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
  };

  React.useEffect(() => {
    (async () => {
      const { posts, total }: any = await getPosts(currentPage, postsPerPage);
      setCurrentPosts(posts);
      setTotalPosts(total);
    })();
  }, [currentPage, type, login]);

  return (
    <div className="mt-14">
      <div className="flex flex-col gap-10">
        <Posts posts={currentPosts} authUser={authUser} isLoading={isLoading} />
      </div>
      {type !== "popular" && totalPosts > postsPerPage && (
        <Paginator
          totalPosts={totalPosts}
          postsPerPage={postsPerPage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};
