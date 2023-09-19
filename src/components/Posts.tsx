import Post from "./Post";

export default function Posts({
  posts,
  users,
  user,
}: {
  posts: Post[];
  users: User[];
  user: User;
}) {
  return (
    <main className="flex flex-col justify-center items-center gap-y-8 py-8 bg-white">
      {posts.map((post: Post) => {
        return <Post post={post} users={users} user={user} key={post.postId} />;
      })}
    </main>
  );
}
