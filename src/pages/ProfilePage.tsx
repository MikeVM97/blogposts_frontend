import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { uploadImage } from "../app/firebase";
import { useNavigate } from "react-router-dom";
import { setUsername, setPhotoUrl } from "../features/userSlice";

const template = {
  newUsername: '',
  newProfile: '',
}

interface Form {
  newUsername: string;
  newProfile: string;
}

export default function ProfilePage () {
  const [formData, setFormdata] = useState<Form>(template);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('failed');
  const [file, setFile] = useState<File>();

  const usernameRef = useRef<HTMLInputElement | null>(null);

  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const URL =
  process.env.NODE_ENV === "production"
  ? import.meta.env.VITE_HOST
  : "http://localhost:3000";

  useEffect(() => {
    const template = {
      newUsername: user.username,
      newProfile: user.photoUrl,
    }
    setFormdata(template);
  }, [user]);

  useEffect(() => {
    if (!isDisabled && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [isDisabled]);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const fileList: FileList | null = e.target.files;
      if (fileList !== null) {
        setFile(fileList[0]);
        const urlImage: string = await uploadImage(fileList[0], user.id);
        setFormdata({
          ...formData,
          newProfile: urlImage,
        });
      } else {
        console.log("No file to upload");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormdata({
      ...formData,
      newUsername: e.currentTarget.value,
    });
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
            <p className="text-2xl font-semibold">¡ Su perfil ha sido actualizado !</p>
          </div>
        }
        
        <button
          className={`absolute top-1 right-1 text-lg font-bold bg-neutral-700 hover:text-black ${statusMessage === 'failed' ? 'text-red-500  hover:bg-red-500' : 'text-green-500 hover:bg-green-500'} rounded-full w-7 h-7 `}
          onClick={() => {
            setShowAlert(false);
            if (statusMessage !== 'failed') {
              navigate('/');
            }
          }}
        >
          x
        </button>
      </div>
    </div>
  );

  async function handleSubmit() {
    setLoader(true);
    try {
      const urlImage: string = await uploadImage(file as File, user.username);
      setFormdata({
        ...formData,
        newProfile: urlImage,
      });
      const data = {
        ...formData,
        oldUsername: user.username,
      }
      const sendForm = await fetch(`${URL}/api/user/updateprofile/${user.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (sendForm.ok) {
        setLoader(false);
        dispatch(setUsername(formData.newUsername));
        dispatch(setPhotoUrl(formData.newProfile));
        setStatusMessage('success');
        setShowAlert(true);
      } else {
        setLoader(false);
        setStatusMessage('failed');
        const { message } = await sendForm.json();
        setErrorMessages(message);
        setShowAlert(true);
      }
    } catch (error) {
      setLoader(false);
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  function getProfileImage() {
    if (formData.newProfile !== "blank") {
      return formData.newProfile;
    } else {
      const defaultProfile =
        user.gender === "Masculino" ? "/male.png" : "/female.png";
      return defaultProfile;
    }
  }

  const profile = getProfileImage();
  const profileStyle = {
    backgroundImage: `url(${profile})`,
  };

/*   const json = fetch("/json/chamarras.json")
  .then((data) => data.json())
  .then((datosfinales) => console.log(datosfinales)); */

  const newChanges = formData.newUsername !== user.username || formData.newProfile !== user.photoUrl;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-y-10 relative bg-gray-200">
      <h2 className="font-semibold text-6xl">Mi perfil</h2>
      <form 
        className="border-2 rounded-xl border-gray-900 flex flex-col gap-y-4 p-4 basis-96 text-xl h-auto bg-slate-200"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="p-2 flex justify-between items-end border-2 border-orange-700 bg-lime-200">
          <div>
            <p className="p-1 text-green-900 font-mono font-semibold text-2xl">Imagen de perfil</p>
            <div
              className={`bg-center bg-cover w-14 h-14 rounded-full`}
              style={profileStyle}
            ></div>
          </div>
          <label
            className="cursor-pointer border border-orange-700 bg-orange-200 rounded-md p-1 hover:bg-orange-400 font-semibold"
            htmlFor="input-file"
          >
            <input
              type="file"
              accept="image/*"
              id="input-file"
              className="hidden"
              onChange={handleImage}
            />
            Cambiar
          </label>
        </div>
        <div className="p-2 flex justify-between items-end border-2 border-orange-700 bg-lime-200">
          <div>
            <p className="p-1 text-green-900 font-mono font-semibold text-2xl">Nombre de usuario</p>
            <input
              className={`${!isDisabled ? 'bg-gray-100' : 'bg-white'} p-1 font-serif rounded-md`}
              type="text"
              value={formData.newUsername}
              size={10}
              disabled={isDisabled}
              ref={usernameRef}
              onChange={handleChange}
            />
          </div>
          <button 
            className="border border-orange-700 bg-orange-200 rounded-md p-1 hover:bg-orange-400 font-semibold"
            onClick={() => setIsDisabled(false)}
          >
            Editar
          </button>
        </div>
        <div className="mt-6 flex justify-evenly items-center">
          <button
            className="text-2xl font-semibold border-2 border-red-500 rounded-md p-1 bg-red-300 hover:bg-red-500"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
          <button
            className={`text-2xl font-semibold border-2 rounded-md p-1 ${!newChanges ? 'border-zinc-500 bg-zinc-300' : 'border-green-500 bg-green-300 hover:bg-green-500'}`}
            type="submit"
            onClick={handleSubmit}
            disabled={!newChanges}
          >
            Confirmar
          </button>
        </div>
      </form>
      {Alert_Component}
      <div className={`${loader ? 'block' : 'hidden'} absolute p-4 bg-gray-200 w-full h-full flex flex-col justify-center items-center`}>
        <h3 className="text-xl font-bold font-mono">Actualizando perfil...</h3>
        <div className="spinner"></div>
      </div>
    </div>
  );
}
