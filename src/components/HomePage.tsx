import { Link, useNavigate } from "react-router-dom";
// import { useGetUsersQuery } from "../services/getUsers";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { RootState } from "../app/store";
import Posts from "./Posts";
import {
  setId,
  setEmail,
  setPassword,
  setPhotoUrl,
  setLogged,
  setIsVerified,
  setUsername,
  setPosts,
} from "../features/userSlice";
import { uploadImage } from "../app/firebase";

export default function HomePage() {
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  // const { data: users, error, isLoading } = useGetUsersQuery();
  const [users, setUsers] = useState([]);
  const [postsOrdered, setPostsOrdered] = useState<Post[]>([]);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const URL =
    process.env.NODE_ENV === "production"
      ? "https://blogposts.up.railway.app"
      : "http://localhost:3000";

  useEffect(() => {
    fetch(`${URL}/users`)
    .then((res) => res.json())
    .then((data) => {
      setUsers(data);
      const posts = data
      .map((user: User) => user.posts)
      .flat()
      .sort((a: Post, b: Post) => Number(b.postId) - Number(a.postId));
      setPostsOrdered(posts);
    })
    .catch((err) => console.error(err));
  }, [URL]);

  async function handleLogout() {
    setLoader(true);
    try {
      const logoutRequest = await fetch(`${URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (logoutRequest.ok) {
        setLoader(false);
        dispatch(setEmail(""));
        dispatch(setId(""));
        dispatch(setIsVerified(false));
        dispatch(setLogged(false));
        dispatch(setPassword(""));
        dispatch(setPhotoUrl("blank"));
        dispatch(setPosts([]));
        dispatch(setUsername(""));
        // navigate(0);
      } else {
        setLoader(false);
        console.log("Error al cerrar sesión.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file: FileList | null = e.target.files;
    if (file !== null) {
      const urlImage: string = await uploadImage(file[0], user.username);
      const sendData = await fetch(
        `${URL}/api/user/updateprofileimage/${user.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPhotoUrl: urlImage }),
        }
      );
      if (sendData.ok) {
        const { newPhotoUrl, newPosts } = await sendData.json();
        if (newPhotoUrl) {
          dispatch(setPhotoUrl(newPhotoUrl));
        }
        if (newPosts) {
          dispatch(setPosts(newPosts));
          navigate(0);
        }
        console.log("Foto de perfil actualizado correctamente.");
      } else {
        console.log("Error al actualizar foto de perfil.");
      }
    } else {
      console.log("No file to upload");
    }
  }

  function goToCreatePost() {
    if (user.isVerified) {
      navigate("/post");
    }
  }

  function getProfileImage() {
    if (user.photoUrl !== "blank") {
      return user.photoUrl;
    } else {
      const defaultProfile =
        user.gender === "Masculino" ? "/male.png" : "/female.png";
      return defaultProfile;
    }
  }

  let posts;
  let content;
  const profile = getProfileImage();
  const profileStyle = {
    backgroundImage: `url(${profile})`,
  };

  if (user.logged) {
    content = (
      <header className="flex justify-between items-center p-4 border-b-2 border-blue-700">
        <label htmlFor="input-file" className="cursor-pointer">
          <div
            style={profileStyle}
            className={`bg-center bg-cover w-14 h-14 rounded-full`}
          ></div>
          <input
            type="file"
            id="input-file"
            className="hidden"
            onChange={handleImage}
          />
        </label>
        <button
          className="border border-zinc-700 py-1 px-2 rounded-lg bg-white hover:text-white hover:bg-zinc-700 hover:border-white text-xl"
          onClick={goToCreatePost}
        >
          Crear Post
        </button>
        <button
          className="border border-zinc-700 py-1 px-2 rounded-lg bg-white hover:text-white hover:bg-zinc-700 hover:border-white text-xl"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </header>
    );
  } else {
    content = (
      <header className="flex justify-between items-center py-4 px-8 border-b-2 border-blue-700">
        <Link
          className="border border-zinc-700 py-1 px-2 rounded-lg bg-white hover:text-white hover:bg-zinc-700 hover:border-white text-xl"
          to="/login"
        >
          Ingreso
        </Link>
        <Link
          className="border border-zinc-700 py-1 px-2 rounded-lg bg-white hover:text-white hover:bg-zinc-700 hover:border-white text-xl"
          to="/register"
        >
          Registro
        </Link>
      </header>
    );
  }

  /* if (isLoading) {
    posts = <div>Loading...</div>;
  }

  if (error) {
    posts = <p>Oh no, un error ah ocurrido</p>;
  } */

  if (!users) {
    posts = <p>Users not found</p>;
  }

  if (users) {
    posts = <Posts posts={postsOrdered} users={users} user={user} />;
  }

  return (
    <div className={`relative bg-gray-300`}>
      <section className={`${loader ? 'hidden' : 'block'}`}>
        {content}
        <h1 className="border-b-2 border-blue-700 text-center p-4 text-5xl">
          BlogPosts
        </h1>
        {posts}
      </section>
      <div className={`${loader ? 'block' : 'hidden'} absolute top-0 left-0 w-screen h-screen p-4 bg-gray-200 flex flex-col justify-center items-center`}>
        <h3 className="text-xl font-bold font-mono">Saliendo...</h3>
        <div className="spinner"></div>
      </div>
    </div>
  );
}
