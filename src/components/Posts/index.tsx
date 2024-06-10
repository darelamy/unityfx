"use client";

import React from "react";
import { IPost } from "@/types/Post";
import { Post } from "@/components/Post";
import { IUser } from "@/types/User";
import LoadingScreen from "@/components/LoadingScreen";
import { EmptyResultBlock } from "@/components/EmptyResultBlock";

interface PostsProps {
  posts: IPost[];
  authUser?: IUser;
  isLoading?: boolean;
}

export const Posts: React.FC<PostsProps> = ({ posts, authUser, isLoading }) => {
  const [currentPosts, setCurrentPosts] = React.useState<IPost[]>([]);

  const handleDeletePost = (postId: string) => {
    setCurrentPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
  };

  React.useEffect(() => {
    setCurrentPosts(posts);
  }, [posts]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && currentPosts.length === 0 && <EmptyResultBlock />}
      {!isLoading &&
        currentPosts.map((post) => (
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
    </>
  );
};
