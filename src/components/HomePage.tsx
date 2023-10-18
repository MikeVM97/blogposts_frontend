import { Link, useNavigate } from "react-router-dom";
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
  setGender,
} from "../features/userSlice";
import { decodeJwt } from "jose";

export default function HomePage() {
  const [postsOrdered, setPostsOrdered] = useState<Post[]>([]);
  const [loader, setLoader] = useState(false);

  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const URL =
  process.env.NODE_ENV === "production"
  ? import.meta.env.VITE_HOST
  : "http://localhost:3000";

  useEffect(() => {
    const verifySession = async() => {
      const cookies = document.cookie.split("; ");
      const keys = cookies.map((cookie) => {
        const key = cookie.slice(0, cookie.indexOf('='));
        const value = cookie.slice(cookie.indexOf('=') + 1);
        return { key, value }
      });
      const token = keys.find((token) => token.key === 'accessToken');
      if (!token) {
        dispatch(setEmail(""));
        dispatch(setId(""));
        dispatch(setIsVerified(false));
        dispatch(setLogged(false));
        dispatch(setPassword(""));
        dispatch(setPhotoUrl("blank"));
        dispatch(setPosts([]));
        dispatch(setUsername(""));
        return;
      }
      const UserDecoded = decodeJwt(token.value);
      const expiration = new Date(UserDecoded.exp as number * 1000);
      if (new Date() > expiration) {
        dispatch(setEmail(""));
        dispatch(setId(""));
        dispatch(setIsVerified(false));
        dispatch(setLogged(false));
        dispatch(setPassword(""));
        dispatch(setPhotoUrl("blank"));
        dispatch(setPosts([]));
        dispatch(setUsername(""));
        return;
      } else {
        dispatch(setEmail(UserDecoded.email));
        dispatch(setGender(UserDecoded.gender));
        dispatch(setId(UserDecoded.id));
        dispatch(setIsVerified(UserDecoded.isVerified));
        dispatch(setLogged(true));
        dispatch(setPhotoUrl(UserDecoded.photoUrl));
        dispatch(setPosts(UserDecoded.posts));
        dispatch(setUsername(UserDecoded.username));
      }
    }
    verifySession();
  }, []);

  useEffect(() => {
    // const cookies = document.cookie;
    // console.log(cookies);
    const getPosts = async() => {
      try {
        const request = await fetch(`${URL}/posts`);
        if (request.ok) {
          const { postsOrdered } = await request.json();
          setPostsOrdered(postsOrdered);
        } else {
          console.log('Error fetch');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          return error;
        }
      }
    }
    getPosts();
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
      } else {
        setLoader(false);
        const { message } = await logoutRequest.json();
        console.log(message);
      }
    } catch (error) {
      console.log(error);
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

  let content;
  const profile = getProfileImage();
  const profileStyle = {
    backgroundImage: `url(${profile})`,
  };

  if (user.logged) {
    content = (
      <header className="flex justify-between items-center p-4 border-b-2 border-blue-700">
        <div
          style={profileStyle}
          onClick={() => navigate('/profile')}
          className={`bg-center bg-cover w-14 h-14 rounded-full cursor-pointer`}
        ></div>
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

  return (
    <div className={`relative bg-gray-300`}>
      <section className={`${loader ? 'hidden' : 'block'}`}>
        {content}
        <h1 className="border-b-2 border-blue-700 text-center p-4 text-5xl">
          BlogPosts
        </h1>
        <Posts postsOrdered={postsOrdered} user={user} setPostsOrdered={setPostsOrdered} />
      </section>
      <div className={`${loader ? 'block' : 'hidden'} absolute top-0 left-0 w-screen h-screen p-4 bg-gray-200 flex flex-col justify-center items-center`}>
        <h3 className="text-xl font-bold font-mono">Saliendo...</h3>
        <div className="spinner"></div>
      </div>
    </div>
  );
}