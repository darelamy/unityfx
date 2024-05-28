"use client";

import axios from "axios";
import React from "react";

import styles from "./SearchPage.module.scss";
import { Post } from "@/components/Post";
import { TagIcon } from "@/icons/TagIcon";
import { UsersIcon } from "@/icons/UsersIcon";
import { IUser } from "@/types/User";
import { IPost } from "@/types/Post";
import { debounce } from "lodash";
import { UsersList } from "@/components/UsersList";

const PostIcon = () => (
  <svg
    width="20.000000"
    height="20.000000"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <path
      id="path"
      d="M4.16 0C3.01 0 2.03 0.4 1.22 1.22C0.4 2.03 0 3.01 0 4.16L0 15.83C0 16.98 0.4 17.96 1.22 18.77C2.03 19.59 3.01 20 4.16 20L15.83 20C16.98 20 17.96 19.59 18.77 18.77C19.59 17.96 20 16.98 20 15.83L20 4.16C20 3.01 19.59 2.03 18.77 1.22C17.96 0.4 16.98 0 15.83 0L4.16 0ZM5.83 5L14.16 5C14.72 5 15 5.27 15 5.83C15 6.38 14.72 6.66 14.16 6.66L5.83 6.66C5.27 6.66 5 6.38 5 5.83C5 5.27 5.27 5 5.83 5ZM5.83 9.16L10.83 9.16C11.38 9.16 11.66 9.44 11.66 10C11.66 10.55 11.38 10.83 10.83 10.83L5.83 10.83C5.27 10.83 5 10.55 5 10C5 9.44 5.27 9.16 5.83 9.16ZM5.83 13.33L14.16 13.33C14.72 13.33 15 13.61 15 14.16C15 14.72 14.72 15 14.16 15L5.83 15C5.27 15 5 14.72 5 14.16C5 13.61 5.27 13.33 5.83 13.33Z"
      fill="#FFFFFF"
      fillOpacity="1.000000"
      fillRule="nonzero"
    />
  </svg>
);

interface SearchPageContentProps {
  authUser?: IUser;
}

type SearchMode = "posts" | "tags" | "users";

export const SearchPageContent: React.FC<SearchPageContentProps> = ({
  authUser,
}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<{
    posts: IPost[];
    users: IUser[];
    tags: string[];
  }>({
    posts: [],
    users: [],
    tags: [],
  });
  const [totalResults, setTotalResults] = React.useState(0);
  const [searchMode, setSearchMode] = React.useState<SearchMode>("posts");

  const handleSearch = React.useCallback(
    async (newQuery: string) => {
      try {
        const response = await axios.get(
          `/api/search?query=${encodeURIComponent(
            query || newQuery
          )}&mode=${searchMode}`
        );

        let posts = [];
        let users = [];
        let tags = [];

        if (searchMode === "posts") posts = response.data.posts || [];
        else if (searchMode === "users") users = response.data.users || [];
        else if (searchMode === "tags") tags = response.data.tags || [];

        setResults({ posts, users, tags });
        setTotalResults(posts.length + users.length + tags.length);
      } catch (error) {
        console.error("Search error:", error);
      }
    },
    [searchMode]
  );

  const debounceOnChange = React.useMemo(() => {
    return debounce((value: string) => handleSearch(value), 500);
  }, [handleSearch]);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    debounceOnChange(value);
  };

  React.useEffect(() => {
    if (query) handleSearch(query);
  }, [searchMode]);

  React.useEffect(() => {
    if (!query) {
      setTotalResults(0);
      setResults({ posts: [], users: [], tags: [] });
    }
  }, [query]);

  return (
    <div className={styles.searchPage}>
      <input
        className={styles.input}
        type="text"
        value={query}
        onChange={onChangeInput}
        placeholder="Введите текстовый запрос"
      />
      <div className="flex justify-between my-10">
        <div className="flex flex-wrap gap-5">
          <button
            disabled={!query}
            className={`${styles.changeTypeButton} ${
              searchMode === "posts" ? styles.changeTypeButtonActive : ""
            } flex items-center`}
            onClick={() => setSearchMode("posts")}
          >
            <PostIcon />
            <span>Посты</span>
          </button>
          <button
            disabled={!query}
            className={`${styles.changeTypeButton} ${
              searchMode === "tags" ? styles.changeTypeButtonActive : ""
            } flex items-center`}
            onClick={() => setSearchMode("tags")}
          >
            <TagIcon />
            <span>Теги</span>
          </button>
          <button
            disabled={!query}
            className={`${styles.changeTypeButton} ${
              searchMode === "users" ? styles.changeTypeButtonActive : ""
            } flex items-center`}
            onClick={() => setSearchMode("users")}
          >
            <UsersIcon />
            <span>Авторы</span>
          </button>
        </div>
      </div>
      <div>
        <div className="mb-10">
          <p className={styles.resultsTitle}>Результатов: {totalResults}</p>
          {totalResults === 0 && (
            <p className={styles.nullResultsText}>
              По данному запросу ничего не найдено
            </p>
          )}
        </div>
        <div className={`${styles.posts} flex flex-col gap-10`}>
          {searchMode === "posts" &&
            results.posts.length > 0 &&
            results.posts.map((post: IPost, index) => (
              <Post
                key={post._id}
                isPostLiked={post.likes.some(
                  (like: any) => like.userId.$oid === authUser?.id
                )}
                {...post}
                id={post._id}
                createdAt={post.$createdAt}
                views={post.views.map((view: any) => {
                  return {
                    ...view,
                    postId: view.postId.$oid,
                    userId: view.userId.$oid,
                  };
                })}
                likes={post.likes.map((like: any) => {
                  return {
                    ...like,
                    id: like?._id?.$oid,
                    postId: like?.postId.$oid,
                    user: {
                      id: like.userId.$oid,
                    },
                  };
                })}
                comments={post.comments.map((comment: any) => {
                  return {
                    ...comment,
                    createdAt: comment.$createdAt,
                    id: comment?._id?.$oid,
                    post: {
                      id: comment?.postId?.$oid,
                    },
                    likes: comment.likes,
                    user: {
                      id: comment?.userId?.$oid,
                    },
                  };
                })}
                authUser={authUser}
              />
            ))}
        </div>
        <div className={styles.users}>
          {searchMode === "users" && (
            <>
              {results.users.length > 0 && (
                <UsersList users={results.users} authUser={authUser} />
              )}
            </>
          )}
        </div>
        <div className={styles.tags}>
          {searchMode === "tags" && (
            <>
              {results.tags.length > 0 &&
                results.tags.map((post: any, index) => (
                  <Post
                    key={post._id.$oid || post._id}
                    id={post._id.$oid || post._id}
                    {...post}
                    createdAt={post.$createdAt}
                    authUser={authUser}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
