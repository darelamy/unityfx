import { NextRequest, NextResponse } from "next/server";
import {
  searchPosts,
  searchPostsByTags,
  searchUsers,
} from "@/services/searchService";
import { IUser } from "@/types/User";
import { IPost } from "@/types/Post";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    let posts: IPost[] = [];
    let users: IUser[] = [];
    let tags: string[] = [];

    const mode = searchParams.get("mode");

    if (mode === "posts") {
      const postsData: any = await searchPosts(query);

      posts = postsData.cursor.firstBatch.map((post: any) => ({
        ...post,
        _id: post._id.$oid || post._id,
      }));
    } else if (mode === "users") {
      users = await searchUsers(query);
    } else if (mode === "tags") {
      const tagsData: any = await searchPostsByTags(query);

      tags = tagsData.cursor.firstBatch.map((post: any) => ({
        ...post,
        _id: post._id.$oid || post._id,
      }));
    } else {
      return NextResponse.json(
        { error: "Invalid search mode" },
        { status: 400 }
      );
    }

    return NextResponse.json({ posts, users, tags }, { status: 200 });
  } catch (error) {
    console.error("Error during search:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
