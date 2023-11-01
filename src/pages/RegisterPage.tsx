import { Link } from "react-router-dom";
import { useState } from "react";
import { RegisterSchema, RegisterData } from "../schemas/registerSchema";
import { safeParseAsync } from "valibot";

const templateUserForm = {
  email: "",
  gender: "Genero",
  password: "",
  password2: "",
  username: "",
};

const templateFormState = {
  email: {
    isMatch: false,
  },
  gender: {
    isMatch: false,
  },
  password: {
    isMatch: false,
  },
  password2: {
    isMatch: false,
  },
  username: {
    isMatch: false,
  },
};

export default function RegisterPage () {
  const [userForm, setUserForm] = useState(templateUserForm);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('failed');
  const [formState, setFormState] = useState(templateFormState);
  const [loader, setLoader] = useState(false);

  const URL =
  process.env.NODE_ENV === "production"
  ? import.meta.env.VITE_HOST
  : "http://localhost:3000";

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const key = e.target.name;
    const updatedUserForm = { ...userForm, [key]: e.target.value };
    setUserForm(updatedUserForm);
    if (key === "password2") {
      setFormState({
        ...formState,
        password2: {
          isMatch: updatedUserForm.password2 === userForm.password,
        },
      });
      return;
    }
    safeParseAsync(RegisterSchema.object[key as keyof RegisterData], updatedUserForm[key as keyof RegisterData])
    .then((data) => {
      setFormState((prevFormState) => ({
        ...prevFormState,
        [key]: {
          isMatch: data.success,
        },
      }));
    })
    .catch((err) => {
      console.log(err);
    });
    
  }

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
    if (e.target.value === "Masculino" || e.target.value === "Femenino") {
      setFormState({
        ...formState,
        gender: {
          isMatch: true,
        }
      })
    }
  }

  const Alert_Component = (
    <div
      className={`${showAlert ? 'block' : 'hidden'} absolute p-4 bg-gray-200 w-full h-full flex flex-col justify-center items-center`}
    >
      <div className={`${statusMessage === 'failed' ? 'border-red-500' : 'border-green-500'} py-8 px-4 border-2 relative w-auto max-w-[60%]`}>
        {
          statusMessage === 'failed' ?
          <ul className="list-none text-xl">
            {errorMessages.map((message, index) => (
              <li className="text-red-500 font-semibold font-serif" key={index}>
                {message}
              </li>
            ))}
          </ul> : 
          <div className="text-xl text-green-500 font-serif flex flex-col gap-y-8">
            <p className="text-2xl font-semibold">¡ Registro exitoso !</p>
            <p>Ahora debe verificar su cuenta para poder hacer uso de su cuenta</p>
            <p>Para ello hemos envíado un enlace de confirmación a su correo electrónico</p>
          </div>
        }
        
        <button
          className={`absolute top-1 right-1 text-lg font-bold bg-neutral-700 hover:text-black ${statusMessage === 'failed' ? 'text-red-500  hover:bg-red-500' : 'text-green-500 hover:bg-green-500'} rounded-full w-7 h-7 `}
          onClick={() => setShowAlert(false)}
        >
          x
        </button>
      </div>
    </div>
  );

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoader(true);
    try {
      const sendUser = await fetch(`${URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      if (sendUser.ok) {
        setLoader(false);
        setStatusMessage('success');
        setShowAlert(true);
      } else {
        setLoader(false);
        setStatusMessage('failed');
        const { message } = await sendUser.json();
        setErrorMessages(message);
        setShowAlert(true);
      }
    } catch (error) {
      setLoader(false);
      const errorMessages = ["Oops! Un error ha ocurrido."];
      setErrorMessages(errorMessages);
      setShowAlert(true);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center relative bg-gray-200">
      <form
        className={`${
          showAlert ? "hidden" : "block"
        } border-2 rounded-xl border-gray-900 flex flex-col gap-y-6 py-6 px-4 basis-96 text-xl h-auto form-register`}
        onSubmit={handleSubmit}
      >
        <div className="w-[100%] flex justify-between items-center gap-x-2">
          <div className="floating-label-group w-[90%]">
            <input
              className="form-control"
              id="email-input-register"
              name="email"
              type="text"
              onChange={handleInput}
              required
            />
            <label className="floating-label" htmlFor="email-input-register">
              Correo electrónico
            </label>
          </div>
          <div className="w-[10%] text-end">
            <span className={`${userForm.email.length > 0 ? 'block' : 'hidden'}`}>
              {formState.email.isMatch ? "✔" : "❌"}
            </span>
          </div>
        </div>
        <div className="w-[100%] flex justify-between items-center gap-x-2">
          <div className="floating-label-group w-[90%]">
            <input
              className="form-control"
              id="password-input-register"
              name="password"
              type="password"
              onChange={handleInput}
              required
            />
            <label className="floating-label" htmlFor="password-input-register">
              Contraseña
            </label>
          </div>
          <div className="w-[10%] text-end">
            <span className={`${userForm.password.length > 0 ? 'block' : 'hidden'}`}>
              {formState.password.isMatch ? "✔" : "❌"}
            </span>
          </div>
        </div>
        <div className="w-[100%] flex justify-between items-center gap-x-2">
          <div className="floating-label-group w-[90%]">
            <input
              className="form-control"
              id="password-input-register2"
              name="password2"
              type="password"
              onChange={handleInput}
              required
            />
            <label
              className="floating-label"
              htmlFor="password-input-register2"
            >
              Confirmar contraseña
            </label>
          </div>
          <div className="w-[10%] text-end">
            <span className={`${userForm.password2.length > 0 ? 'block' : 'hidden'}`}>
              {formState.password2.isMatch ? "✔" : "❌"}
            </span>
          </div>
        </div>
        <div className="w-[100%] flex justify-between items-center gap-x-2">
          <div className="floating-label-group w-[90%]">
            <input
              className="form-control"
              id="username-input"
              name="username"
              type="text"
              onChange={handleInput}
              required
            />
            <label className="floating-label" htmlFor="username-input">
              Nombre de usuario
            </label>
          </div>
          <div className="w-[10%] text-end">
            <span className={`${userForm.username.length > 0 ? 'block' : 'hidden'}`}>
              {formState.username.isMatch ? "✔" : "❌"}
            </span>
          </div>
        </div>
        <div className="w-[100%] flex justify-between items-center gap-x-2">
          <div className="floating-label-group w-[90%] flex flex-col gap-y-2">
            <label htmlFor="select-genero">Género:</label>
            <select
              className="border border-zinc-900 bg-white mb-10 p-2 text-base w-full"
              value={userForm.gender}
              id="select-genero"
              name="gender"
              onChange={handleSelect}
            >
              <option disabled value="Genero">
                -- Seleccione un género --
              </option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div className="w-[10%] text-end">
            <span className={`${userForm.gender === "Masculino" || userForm.gender === "Femenino" ? 'block' : 'hidden'}`}>
              {formState.gender.isMatch ? "✔" : "❌"}
            </span>
          </div>
        </div>

        <button
          className="border-2 rounded-md w-1/2 m-auto p-1 text-2xl border-white text-white bg-zinc-800 hover:bg-white hover:text-zinc-800 hover:border-zinc-800"
          type="submit"
        >
          Registrar
        </button>
      </form>
      <Link
        className="hidden sm:block absolute bottom-4 right-4 text-xl font-semibold p-1 border-2 rounded-md border-green-700 bg-white text-green-900 hover:bg-green-800 hover:text-white"
        to="/"
      >
        👈 Volver
      </Link>
      {Alert_Component}
      <div className={`${loader ? 'block' : 'hidden'} absolute p-4 bg-gray-200 w-full h-full flex flex-col justify-center items-center`}>
        <h3 className="text-xl font-bold font-mono">Registrando...</h3>
        <div className="spinner"></div>
      </div>
    </div>
  );
}
