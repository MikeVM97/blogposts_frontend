import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"

import { useAppDispatch } from "store/hook"
import {
	setEmail,
	setGender,
	setId,
	setLogged,
	setIsVerified,
	setPhotoUrl,
	setPosts,
	setUsername
} from "reducers/userSlice"

import { URL } from "../constants"

const template = {
	email: "",
	password: ""
}

export default function LoginPage() {
	const [userForm, setUserForm] = useState(template)
	const [showAlert, setShowAlert] = useState<boolean>(false)
	const [textMessages, setTextMessages] = useState<string[]>([])
	const [statusMessage, setStatusMessage] = useState("")
	const [userId, setUserId] = useState("")
	const [userName, setUserName] = useState("")
	const [loader, setLoader] = useState(false)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
		setUserForm({
			...userForm,
			email: e.target.value
		})
	}

	function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
		setUserForm({
			...userForm,
			password: e.target.value
		})
	}

	async function resendEmailVerification() {
		try {
			const sendVerification = await fetch(
				`${URL}/api/user/resendemail/${userId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ email: userForm.email, username: userName })
				}
			)

			if (sendVerification.ok) {
				alert("El email de verificación ha sido envíado.")
			} else {
				console.log("Error al enviar el email de verificación.")
			}
		} catch (error) {
			console.log(error)
		}
	}

	const Alert_Component = (
		<div
			className={`${
				showAlert ? "block" : "hidden"
			} absolute p-4 bg-gray-200 w-full h-full flex flex-col justify-center items-center`}
		>
			<div
				className={`border-2 border-red-500 text-red-500 text-xl py-8 px-4 relative w-auto max-w-[60%]`}
			>
				{statusMessage === "not_verified" ? (
					<div className="flex justify-center flex-col gap-y-6">
						<p className="text-2xl font-semibold">
							Es necesario verificar su cuenta.
						</p>
						<p>
							Haga click en el siguiente botón para envíar un mensaje de
							verificación a su correo electrónico.
						</p>
						<button
							className="border-2 border-red-500 px-2 py-1 rounded-lg bg-white text-red-500 hover:bg-red-500 hover:text-white"
							onClick={resendEmailVerification}
						>
							Enviar
						</button>
					</div>
				) : (
					<ul className="list-none">
						{textMessages.map((message, index) => {
							return (
								<li className="" key={index}>
									{message}
								</li>
							)
						})}
					</ul>
				)}

				<button
					className={`absolute top-1 right-1 text-lg font-bold bg-neutral-700 hover:text-black rounded-full w-7 h-7 text-red-500  hover:bg-red-500`}
					onClick={() => setShowAlert(false)}
				>
					x
				</button>
			</div>
		</div>
	)

	async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
		e.preventDefault()
		setLoader(true)
		try {
			const sendUser = await fetch(`${URL}/api/auth/login`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(userForm)
			})

			if (sendUser.ok) {
				setLoader(false)
				const userFound = await sendUser.json()
				dispatch(setEmail(userFound.email))
				dispatch(setGender(userFound.gender))
				dispatch(setId(userFound.id))
				dispatch(setIsVerified(userFound.isVerified))
				dispatch(setLogged(true))
				dispatch(setPhotoUrl(userFound.photoUrl))
				dispatch(setPosts(userFound.posts))
				dispatch(setUsername(userFound.username))
				navigate("/")
			} else {
				setLoader(false)
				const { message, not_verified, id, username } = await sendUser.json()
				if (message) {
					setStatusMessage("")
					setTextMessages(message)
					setShowAlert(true)
					return
				}
				if (not_verified) {
					setUserId(id)
					setUserName(username)
					setStatusMessage("not_verified")
					setShowAlert(true)
					return
				}
			}
		} catch (error) {
			setLoader(false)
			console.log(error)
		}
	}

	return (
		<div className="w-screen h-screen flex items-center justify-center relative bg-gray-200">
			<form
				className={`border-2 rounded-xl border-gray-900 flex flex-col gap-y-6 py-8 px-4 basis-96 text-xl h-auto bg-slate-200 ${
					showAlert ? "hidden" : "block"
				}`}
				onSubmit={handleSubmit}
			>
				<div className="floating-label-group w-[100%]">
					<input
						className="form-control"
						id="email-input-login"
						name="email"
						type="text"
						onChange={handleEmail}
						required
					/>
					<label className="floating-label" htmlFor="email-input-login">
						Correo electrónico
					</label>
				</div>
				<div className="floating-label-group w-[100%]">
					<input
						className="form-control"
						id="password-input-login"
						type="password"
						onChange={handlePassword}
						required
					/>
					<label className="floating-label" htmlFor="password-input-login">
						Contraseña:
					</label>
				</div>
				<button
					className="border-2 rounded-md w-1/2 m-auto p-1 text-2xl border-white text-white bg-zinc-800 hover:bg-white hover:text-zinc-800 hover:border-zinc-800"
					type="submit"
				>
					Ingresar
				</button>
			</form>
			<Link
				className="hidden sm:block absolute bottom-4 right-4 text-xl font-semibold p-1 border-2 rounded-md border-green-700 bg-white text-green-900 hover:bg-green-800 hover:text-white"
				to="/"
			>
				👈 Volver
			</Link>
			{Alert_Component}
			<div
				className={`${
					loader ? "block" : "hidden"
				} absolute p-4 bg-gray-200 w-full h-full flex flex-col justify-center items-center`}
			>
				<h3 className="text-xl font-bold font-mono">Ingresando...</h3>
				<div className="spinner"></div>
			</div>
		</div>
	)
}
