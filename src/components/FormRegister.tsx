import { Link } from "react-router-dom";
import { useState } from "react";
import "dotenv/config";

const template = {
  email: "",
  gender: "Masculino",
  password: "",
  password2: "",
  username: "",
}

export default function FormRegister() {
  const [userForm, setUserForm] = useState(template);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const URL = process.env.NODE_ENV === "production" 
  ? "https://blogposts.up.railway.app/"
  : "http://localhost:3000";

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  }

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
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
      const sendUser = await fetch(`${URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      if (sendUser.ok) {
        console.log("Usuario registrado exitosamente.");
      } else {
        const { message } = await sendUser.json();
        setErrorMessages(message);
        setShowAlert(true);
      }
    } catch (error) {
      const errorMessages = ["Oops! Un error ha ocurrido."];
      setErrorMessages(errorMessages);
      setShowAlert(true);
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
        <label
          className="opacity-50 flex justify-between items-center"
          htmlFor="email-input-register"
        >
          <p>Email:</p>
          <img
            className="hover:cursor-help"
            src="/circle.png"
            alt="sobre el correo"
            width="25"
            height="25"
            title="Dominios aceptados: @gmail.com, @hotmail.com"
          />
        </label>
        <input
          className="border border-gray-600 mb-4"
          id="email-input-register"
          name="email"
          type="text"
          onChange={handleInput}
          required
        />
        <label className="opacity-50" htmlFor="password-input-register">
          Contraseña:
        </label>
        <input
          className="border border-gray-600 mb-4"
          id="password-input-register"
          name="password"
          type="password"
          onChange={handleInput}
          required
        />
        <label className="opacity-50" htmlFor="password-input-register2">
          Confirmar constraseña:
        </label>
        <input
          className="border border-gray-600 mb-4"
          id="password-input-register2"
          name="password2"
          type="password"
          onChange={handleInput}
          required
        />
        <label className="opacity-50" htmlFor="username-input">
          Nombre de usuario:
        </label>
        <input
          className="border border-gray-600 mb-4"
          id="username-input"
          name="username"
          type="text"
          onChange={handleInput}
          required
        />
        <label className="opacity-50" htmlFor="select-genero">
          Género:
        </label>
        <select
          className="border border-gray-600 bg-white mb-10"
          id="select-genero"
          name="gender"
          onChange={handleSelect}
        >
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>

        <button
          className="border-2 rounded-md w-1/2 m-auto p-1 text-2xl text-white bg-zinc-800"
          type="submit"
        >
          Registrar
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
