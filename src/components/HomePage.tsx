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
    const getUsers = async() => {
      try {
        const request = await fetch(`${URL}/users`, {
          method: "POST"
        });
        if (request.ok) {
          const data = await request.json();
          setUsers(data);
          const posts = data
          .map((user: User) => user.posts)
          .flat()
          .sort((a: Post, b: Post) => {
            // b.date => 'comentado en 15 Julio, 2023'
            const index1 = a.date.indexOf('en ') + 3;
            const post1 = a.date.substring(index1);

            const index2 = b.date.indexOf('en ') + 3;
            const post2 = b.date.substring(index2);

            return Number(strToDate(post2)) - Number(strToDate(post1));
          });
          setPostsOrdered(posts);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          return error;
        }
      }
    }
    
    getUsers();
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
    posts = <Posts postsOrdered={postsOrdered} users={users} user={user} setPostsOrdered={setPostsOrdered} />;
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


function strToDate(str: string) {
  const array = str.split(' ');
  const day: number = parseInt(array[0], 10);
  const month = array[1].slice(0, array[1].length - 1);
  const year: number = parseInt(array[2], 10);
  const months: Months = {
    Enero: 0,
    Febrero: 1,
    Marzo: 2,
    Abril: 3,
    Mayo: 4,
    Junio: 5,
    Julio: 6,
    Agosto: 7,
    Septiembre: 8,
    Octubre: 9,
    Noviembre: 10,
    Diciembre: 11,
  };
  const date = new Date(year, months[month as keyof Months], day);
  return date;
}