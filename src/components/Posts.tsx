import { Dispatch, SetStateAction } from "react";
import Post from "./Post";

export default function Posts({
  postsOrdered,
  user,
  setPostsOrdered,
}: {
  postsOrdered: Post[];
  user: User;
  setPostsOrdered: Dispatch<SetStateAction<Post[]>>;
}) {
  return (
    <main className="flex flex-col justify-center items-center gap-y-8 py-8 bg-white">
      {postsOrdered.map((post: Post) => {
        return <Post post={post} user={user} key={post.postId} postsOrdered={postsOrdered} setPostsOrdered={setPostsOrdered} />;
      })}
    </main>
  );
}
