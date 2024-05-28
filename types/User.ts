export interface IUser {
  id: string;
  login: string;
  avatarUrl: string;
  desc: string;
  followsCount: number;
  followersCount: number;
  followingIDs?: string[];
  followedByIDs?: string[];
}
