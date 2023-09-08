interface Reaction {
  count: number;
  reactedBy: string[] | [];
}

interface Reactions {
  thumbsUp: Reaction;
  thumbsDown: Reaction;
  smile: Reaction;
  hooray: Reaction;
  unhappy: Reaction;
  heart: Reaction;
}

interface Post {
  title: string;
  body: string;
  author: string;
  date: string;
  photoUrl: string;
  postId: string;
  reactions: Reactions;
}

interface User {
  id: string;
  email: string;
  gender: string;
  isVerified: boolean;
  logged: boolean;
  password: string;
  photoUrl: string;
  posts: Post[] | [];
  username: string;
}