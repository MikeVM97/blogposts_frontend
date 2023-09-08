import Post from "./Post";

import { Dispatch, SetStateAction } from "react";

export default function Posts({
  posts,
  users,
  user,
  setText,
  setIsHidden,
}: {
  posts: Post[];
  users: User[];
  user: User;
  setText: Dispatch<SetStateAction<string>>;
  setIsHidden: Dispatch<SetStateAction<boolean>>;
}) {

  return (
    <main className="flex flex-col justify-center items-center gap-y-8 py-8 bg-white">
      {posts.map((post: Post) => {
        return <Post post={post} users={users} user={user} setIsHidden={setIsHidden} key={post.postId} setText={setText} />;
      })}
    </main>
  );
}
