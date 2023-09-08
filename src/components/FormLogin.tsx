import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ValiError } from "valibot";
import { useAppDispatch } from "../app/hook";
import {
  setEmail,
  setGender,
  setId,
  setLogged,
  setIsVerified,
  setPhotoUrl,
  setPosts,
  setUsername,
} from "../features/userSlice";

const template = {
  email: "",
  password: "",
};

export default function FormLogin() {
  const [userForm, setUserForm] = useState(template);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const URL = import.meta.env.MODE === "production"
  ? "https://blogposts.up.railway.app/"
  : "http://localhost:3000";

  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setUserForm({
      ...userForm,
      email: e.target.value,
    });
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setUserForm({
      ...userForm,
      password: e.target.value,
    });
  }

  const Alert_Component = (
    <div
      className={`border-2 border-orange-700 absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 p-6 bg-zinc-800 text-white ${
        showAlert ? "block" : "hidden"
      }`}
    >
      <ul className="list-disc text-xl mt-2">
        {errorMessages.map((message, index) => (
          <li className="text-red-500" key={index}>
            {message}
          </li>
        ))}
      </ul>
      <button
        className="absolute top-1 right-1 text-xl"
        onClick={() => setShowAlert(false)}
      >
        ❌
      </button>
    </div>
  );

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const sendUser = await fetch(`${URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (sendUser.ok) {
        const userFound = await sendUser.json();
        dispatch(setEmail(userFound.email));
        dispatch(setGender(userFound.gender));
        dispatch(setId(userFound.id));
        dispatch(setIsVerified(userFound.isVerified));
        dispatch(setLogged(true));
        dispatch(setPhotoUrl(userFound.photoUrl));
        dispatch(setPosts(userFound.posts));
        dispatch(setUsername(userFound.username));
        navigate('/');
        // window.open("http://localhost:5173", "_self");
      } else {
        const { message } = await sendUser.json();
        setErrorMessages(message);
        setShowAlert(true);
      }
    } catch (error) {
      if (error instanceof ValiError) {
        const issues = error.issues;
        const errorMessages = issues.map((issue) => issue.message);
        setErrorMessages(errorMessages);
      } else {
        const errorMessages = ["Oops! Un error ha ocurrido."];
        setErrorMessages(errorMessages);
      }
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center relative bg-gray-200">
      <form
        className={`border-2 rounded-xl border-gray-900 flex flex-col gap-y-1 p-4 basis-96 text-xl h-auto bg-slate-200 ${
          showAlert ? "hidden" : "block"
        }`}
        onSubmit={handleSubmit}
      >
        <label className="opacity-50" htmlFor="email-input-login">
          Email:
        </label>
        <input
          className="border border-gray-600 mb-4"
          id="email-input-login"
          type="text"
          onChange={handleEmail}
          required
        />
        <label className="opacity-50" htmlFor="password-input-login">
          Contraseña:
        </label>
        <input
          className="border border-gray-600 mb-10"
          id="password-input-login"
          type="password"
          onChange={handlePassword}
          required
        />
        <button
          className="border-2 rounded-md w-1/2 m-auto p-1 text-2xl text-white bg-zinc-800"
          type="submit"
        >
          Ingresar
        </button>
      </form>
      <Link
        className="hidden sm:block absolute bottom-4 right-4 text-xl p-1 border-2 rounded-md border-red-700 bg-white"
        to="/"
      >
        👈 Volver
      </Link>
      {Alert_Component}
    </div>
  );
}
