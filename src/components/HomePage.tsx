import { Link, useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../services/getUsers";
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
  const { data: users, error, isLoading } = useGetUsersQuery();
  const [postsOrdered, setPostsOrdered] = useState<Post[]>([]);
  const [isHidden, setIsHidden] = useState(true);
  const [text, setText] = useState('PARA COMENZAR A CREAR POSTS');

  const navigate = useNavigate();

  const URL = import.meta.env.MODE === "production"
  ? "https://blogposts.up.railway.app"
  : "http://localhost:3000";

  useEffect(() => {
    fetch(`${URL}/api/auth/verify`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
      if (!data.message) {
        dispatch(setLogged(true));
      } else {
        dispatch(setLogged(false));
      }
    })
    .catch(err => console.error(err));
  }, [dispatch, URL]);

  useEffect(() => {
    if (users) {
      const posts = users
        .map((user) => user.posts)
        .flat()
        .sort((a, b) => Number(b.postId) - Number(a.postId));
      setPostsOrdered(posts);
    }
  }, [users]);

  async function handleLogout() {
    try {
      const logoutRequest = await fetch(`${URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (logoutRequest.ok) {
        dispatch(setEmail(""));
        dispatch(setId(""));
        dispatch(setIsVerified(false));
        dispatch(setLogged(false));
        dispatch(setPassword(""));
        dispatch(setPhotoUrl("blank"));
        dispatch(setPosts([]));
        dispatch(setUsername(""));
        navigate(0);
      } else {
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
      const sendData = await fetch(`${URL}/api/user/updateprofileimage/${user.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPhotoUrl: urlImage }),
      });
      if (sendData.ok) {
        const { newPhotoUrl, newPosts } =  await sendData.json();
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
    } else {
      setIsHidden(false);
    }
  }

  async function resendEmailVerification() {
    try {
      const sendVerification = await fetch(`${URL}/api/user/resendemail/${user.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (sendVerification.ok) {
        alert("El email de verificación ha sido envíado.");
      } else {
        console.log("Error al enviar el email de verificación.");
      }
    } catch (error) {
      console.log(error)
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
      <header className="flex justify-between items-center p-4 border-2 border-blue-700">
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
      <header className="flex justify-between items-center py-4 px-8">
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

  if (isLoading) {
    posts = <div>Loading...</div>;
  }

  if (error) {
    posts = <p>Oh no, un error ah ocurrido</p>;
  }

  if (!users) {
    posts = <p>Users not found</p>;
  }

  if (users) {
    posts = <Posts posts={postsOrdered} users={users} user={user} setIsHidden={setIsHidden} setText={setText} />;
  }

  return (
    <div className={`relative bg-gray-300`}>
      {content}
      <h1 className="border-y-2 border-blue-700 text-center p-4 text-5xl">
        BlogPosts
      </h1>
      {posts}
      <div className={`${!isHidden ? 'block' : 'hidden'} absolute top-0 left-0 w-full h-full bg-gray-300/60`}>
      </div>
      <div className={`fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 border-2 border-orange-950 rounded-xl p-4 text-center bg-slate-200 ${!isHidden ? 'block' : 'hidden'}`}>
        <p className="p-2">
          {text} PRIMERO DEBE VERIFICAR SU CUENTA.
        </p>
        <p className="p-2">
          HAGA CLICK AQUÍ PARA ENVÍAR UN MENSAJE DE VERIFICACIÓN A SU CORREO ELECTRÓNICO:
        </p>
        <button 
          className="border-2 border-orange-900 px-2 py-1 rounded-lg bg-white hover:bg-orange-900 hover:text-white"
          onClick={resendEmailVerification}
        >
          Enviar
        </button>
        <button
          className="absolute top-2 right-2 rounded-full border-2 border-orange-900 bg-white hover:bg-orange-900 hover:text-white w-7 h-7"
          onClick={() => setIsHidden(true)}
        >
          <span className="absolute top-[37%] left-[52%] -translate-y-2/4 -translate-x-2/4 text-xl">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
