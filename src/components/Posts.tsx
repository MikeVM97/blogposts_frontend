import { Dispatch, SetStateAction } from "react";
import Post from "./Post";

export default function Posts({
  postsOrdered,
  users,
  user,
  setPostsOrdered,
}: {
  postsOrdered: Post[];
  users: User[];
  user: User;
  setPostsOrdered: Dispatch<SetStateAction<Post[]>>;
}) {
  return (
    <main className="flex flex-col justify-center items-center gap-y-8 py-8 bg-white">
      {postsOrdered.map((post: Post) => {
        return <Post post={post} users={users} user={user} key={post.postId} postsOrdered={postsOrdered} setPostsOrdered={setPostsOrdered} />;
      })}
    </main>
  );
}
