import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hook";
import { type RootState } from "../app/store";

const template = {
  title: "",
  body: "",
}

export default function CreatePost() {
  const user = useAppSelector((state: RootState) => state.user);
  const [post, setPost] = useState(template);
  const navigate = useNavigate();

  const URL = import.meta.env.MODE === "production"
  ? "https://blogposts.up.railway.app"
  : "http://localhost:3000";

  const URL_FRONT = import.meta.env.MODE === "production"
  ? "https://blogposts-frontend.vercel.app"
  : "http://localhost:5173";

  useEffect(() => {
    if (!user.isVerified) {
      navigate('/');
    }
  }, [user.isVerified, navigate]);
  
  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const sendUser = await fetch(`${URL}/api/posts/createpost/${user.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (sendUser.ok) {
        window.open(URL_FRONT, "_self");
        console.log("Post creado con éxito");
      } else {
        console.log("Error al crear Post");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center relative bg-gray-200">
      <form
        className={`border-2 rounded-xl border-gray-900 flex flex-col gap-y-1 p-4 basis-96 text-xl h-auto bg-slate-200`}
        onSubmit={handleSubmit}
      >
        <label className="opacity-50" htmlFor="post-title">
          Título:
        </label>
        <input
          className="border border-gray-600 mb-4 p-1" 
          id="post-title" 
          type="text" 
          onChange={(e) => {
            setPost({
              ...post,
              title: e.target.value,
            })
          }} 
          required 
        />
        <label className="opacity-50" htmlFor="post-body">
          Mensaje:
        </label>
        <textarea 
          className="border border-gray-600 mb-10 resize-none p-1" 
          id="post-body" 
          cols={30} 
          rows={10} 
          onChange={(e) => {
            setPost({
              ...post,
              body: e.target.value,
            })
          }} 
          required 
        >

        </textarea>
        <button
          className="border-2 rounded-md w-1/2 m-auto p-1 text-2xl text-white bg-zinc-800"
          type="submit"
        >
          Crear post
        </button>
      </form>
      <Link
        className="hidden sm:block absolute bottom-4 right-4 text-xl p-1 border-2 rounded-md border-red-700 bg-white"
        to="/"
      >
        👈 Volver
      </Link>
    </div>
  );
}
