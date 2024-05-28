"use client";

import { Post } from "@/components/Post";
import { Paginator } from "@/components/Paginator";
import React from "react";
import { IUser } from "@/types/User";
import { IPost } from "@/types/Post";
import { apiUrl } from "@/src/app/api/apiUrl";
import axios from "axios";

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

  const postsPerPage = 5;

  const getPosts = async (page: number, postsPerPage: number) => {
    if (type === "profile") {
      const response = await axios.get<{
        user: IUser;
        posts: IPost[];
        total: number;
      }>(`${apiUrl}/api/users/${login}?page=${page}&limit=${postsPerPage}`);
      return response.data;
    } else {
      const response = await axios.get<{
        posts: IPost[];
        data: IPost[];
        total: number;
      }>(`${apiUrl}/api/posts?page=${page}&limit=${postsPerPage}`);
      return response.data;
    }
  };

  React.useEffect(() => {
    (async () => {
      if (type === "popular") {
        const { data } = await axios.get(`${apiUrl}/api/posts/popular`);

        setCurrentPosts(data);
      } else {
        const { posts, total } = await getPosts(currentPage, postsPerPage);

        setCurrentPosts(posts);
        setTotalPosts(total);
      }
    })();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeletePost = (postId: string) => {
    setCurrentPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
  };

  return (
    <div className="mt-14">
      <div className="flex flex-col gap-10">
        {currentPosts?.map((post) => (
          <Post
            key={post.id}
            {...post}
            authUser={authUser}
            isPostLiked={post?.likes?.some(
              (like) => like.user.id === authUser?.id
            )}
            onDeletePost={handleDeletePost}
          />
        ))}
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
