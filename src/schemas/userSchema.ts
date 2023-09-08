import { string, number, boolean, object, array, type Output } from "valibot";

export const LoginSchema = object({
  id: string(),
  email: string(),
  password: string(),
  gender: string(),
  photoUrl: string(),
  logged: boolean(),
  username: string(),
  posts: array(
    object({
      title: string(),
      body: string(),
      author: string(),
      date: string(),
      photoUrl: string(),
      postId: string(),
      reactions: object({
        thumbsUp: object({
          count: number(),
          reactedBy: array(string()),
        }),
        thumbsDown: object({
          count: number(),
          reactedBy: array(string()),
        }),
        smile: object({
          count: number(),
          reactedBy: array(string()),
        }),
        hooray: object({
          count: number(),
          reactedBy: array(string()),
        }),
        unhappy: object({
          count: number(),
          reactedBy: array(string()),
        }),
        heart: object({
          count: number(),
          reactedBy: array(string()),
        }),
      })
    })
  )
});

export type LoginData = Output<typeof LoginSchema>;