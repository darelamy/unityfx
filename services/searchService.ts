import prismadb from "@/lib/prisma/prismadb";

export const searchPosts = async (query: string) => {
  return prismadb.$runCommandRaw({
    aggregate: "Post",
    pipeline: [
      {
        $match: {
          $or: [
            { tags: { $in: [query] } },
            { "body.data.text": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "user.passwordHash": 0,
          "user.email": 0,
        },
      },
      {
        $lookup: {
          from: "PostFile",
          localField: "_id",
          foreignField: "postId",
          as: "files",
        },
      },
      {
        $lookup: {
          from: "PostLike",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "Comment",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "View",
          localField: "_id",
          foreignField: "postId",
          as: "views",
        },
      },
    ],
    cursor: {},
  });
};

export const searchUsers = async (query: string) => {
  const users = await prismadb.user.findMany({
    where: {
      OR: [{ login: { contains: query, mode: "insensitive" } }],
    },
  });
  return users.map((user) => {
    const { passwordHash, email, ...data } = user;

    return data;
  });
};

export const searchPostsByTags = async (query: string) => {
  return prismadb.$runCommandRaw({
    aggregate: "Post",
    pipeline: [
      {
        $match: {
          tags: { $in: [query] },
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "PostFile",
          localField: "_id",
          foreignField: "postId",
          as: "files",
        },
      },
      {
        $lookup: {
          from: "PostLike",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "Comment",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "View",
          localField: "_id",
          foreignField: "postId",
          as: "views",
        },
      },
    ],
    cursor: {},
  });
};
