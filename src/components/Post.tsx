import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react"

import { useNavigate } from "react-router-dom"

import { useAppDispatch } from "store/hook"
import { setPosts } from "reducers/userSlice"

interface QuantityReactions {
	text: string
	spare: number
}

interface ReactionsByUsers {
	thumbsUp: QuantityReactions
	thumbsDown: QuantityReactions
	smile: QuantityReactions
	hooray: QuantityReactions
	unhappy: QuantityReactions
	heart: QuantityReactions
}

const templateQuantityReactions = {
	thumbsUp: {
		text: "",
		spare: 0
	},
	thumbsDown: {
		text: "",
		spare: 0
	},
	smile: {
		text: "",
		spare: 0
	},
	hooray: {
		text: "",
		spare: 0
	},
	unhappy: {
		text: "",
		spare: 0
	},
	heart: {
		text: "",
		spare: 0
	}
}

export default function Post({
	post,
	user,
	postsOrdered,
	setPostsOrdered
}: {
	post: Post
	user: User
	postsOrdered: Post[]
	setPostsOrdered: Dispatch<SetStateAction<Post[]>>
}) {
	const [postState, setPostState] = useState<Post>(post)
	const [isOpen, setIsOpen] = useState(false)
	const [reactionsList, setReactionsList] = useState<ReactionsByUsers>(
		templateQuantityReactions
	)
	const [postOptionsActive, setPostOptionsActive] = useState(false)
	const [deleting, setDeleting] = useState("Eliminando...")
	const [profileImage, setProfileImage] = useState("")
	const [userID, setUserID] = useState("")
	const [author, setAuthor] = useState("")

	const navigate = useNavigate()

	const dispatch = useAppDispatch()

	useEffect(() => {
		const obj: ReactionsByUsers = { ...templateQuantityReactions }

		for (const key in postState.reactions) {
			const arr = postState.reactions[key as keyof Reactions].reactedBy
			let str = ""
			let sobrante = 0
			if (arr.length === 1) {
				str = arr[0]
			}
			if (arr.length > 7) {
				const copy = arr.slice(0, 7)
				str = copy.join(", ") + ","
				sobrante = arr.length - copy.length
			}
			if (arr.length > 1 && arr.length < 8) {
				const copy = arr.slice(0, arr.length - 1)
				str = copy.join(", ") + " y " + arr[arr.length - 1]
			}

			obj[key as keyof ReactionsByUsers] = {
				text: str,
				spare: sobrante
			}
		}

		setReactionsList(obj)
	}, [postState.reactions])

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				optionsRef.current &&
				!optionsRef.current.contains(e.target as Node)
			) {
				setPostOptionsActive(false)
			}
			if (
				detailsRef.current &&
				!detailsRef.current.contains(e.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener("click", handleClickOutside)
		return () => {
			document.removeEventListener("click", handleClickOutside)
		}
	}, [])

	const URL =
		process.env.NODE_ENV === "production"
			? import.meta.env.VITE_HOST
			: "http://localhost:3000"

	const detailsRef = useRef<HTMLDetailsElement | null>(null)
	const optionsRef = useRef<HTMLButtonElement | null>(null)

	const dialogRef = useRef<HTMLDialogElement | null>(null)

	const thumbsUpRef = useRef<HTMLButtonElement | null>(null)
	const thumbsDownRef = useRef<HTMLButtonElement | null>(null)
	const smileRef = useRef<HTMLButtonElement | null>(null)
	const hoorayRef = useRef<HTMLButtonElement | null>(null)
	const unhappyRef = useRef<HTMLButtonElement | null>(null)
	const heartRef = useRef<HTMLButtonElement | null>(null)

	const thumbsUpReacted = postState.reactions.thumbsUp.reactedBy.some(
		(x) => x === user.username
	)
	const thumbsDownReacted = postState.reactions.thumbsDown.reactedBy.some(
		(x) => x === user.username
	)
	const smileReacted = postState.reactions.smile.reactedBy.some(
		(x) => x === user.username
	)
	const hoorayReacted = postState.reactions.hooray.reactedBy.some(
		(x) => x === user.username
	)
	const unhappyReacted = postState.reactions.unhappy.reactedBy.some(
		(x) => x === user.username
	)
	const heartReacted = postState.reactions.heart.reactedBy.some(
		(x) => x === user.username
	)

	// GET USER PROFILE
	useEffect(() => {
		async function getSourceImage() {
			try {
				const request = await fetch(`${URL}/api/user/photo/${postState.postId}`)
				if (request.ok) {
					const { photoURL, gender } = await request.json()
					if (photoURL) {
						setProfileImage(photoURL)
						return
					}
					if (gender) {
						if (gender === "Masculino") {
							setProfileImage("/male.png")
							return "/male.png"
						}
						if (gender === "Femenino") {
							setProfileImage("/female.png")
							return "/female.png"
						}
					}
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log(error)
				}
			}
		}
		getSourceImage()
	}, [URL, postState.postId])

	// GET USER ID
	useEffect(() => {
		async function getUserId() {
			try {
				const request = await fetch(`${URL}/api/user/id/${postState.postId}`)
				if (request.ok) {
					const { id } = await request.json()
					setUserID(id)
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log(error)
				}
			}
		}
		getUserId()
	}, [URL, postState.postId])

	// GET USER AUTHOR
	useEffect(() => {
		async function getAuthor() {
			try {
				const request = await fetch(
					`${URL}/api/user/author/${postState.postId}`
				)
				if (request.ok) {
					const { author } = await request.json()
					setAuthor(author)
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log(error)
				}
			}
		}
		getAuthor()
	}, [URL, postState.postId])

	const profileStyle = {
		backgroundImage: `url(${profileImage})`
	}

	const { thumbsUp, thumbsDown, smile, hooray, unhappy, heart } =
		postState.reactions

	let flag = true

	if (
		thumbsUp.count > 0 ||
		thumbsDown.count > 0 ||
		smile.count > 0 ||
		hooray.count > 0 ||
		unhappy.count > 0 ||
		heart.count > 0
	) {
		flag = false
	}

	async function handleClickReactionOne(
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		e.stopPropagation()
		try {
			if (user.logged) {
				const emoji = e.currentTarget.name as keyof Reactions

				let newReactions: Reactions = { ...postState.reactions }

				const userHasReacted = postState.reactions[emoji].reactedBy.some(
					(x) => x === user.username
				)

				if (userHasReacted) {
					if (postState.reactions[emoji].count > 0) {
						newReactions = {
							...postState.reactions,
							[emoji]: {
								...postState.reactions[emoji],
								count: postState.reactions[emoji].count - 1,
								reactedBy: [
									...postState.reactions[emoji].reactedBy.filter(
										(x) => x !== user.username
									)
								]
							}
						}
					}
				} else {
					newReactions = {
						...postState.reactions,
						[emoji]: {
							...postState.reactions[emoji],
							count: postState.reactions[emoji].count + 1,
							reactedBy: [
								...postState.reactions[emoji].reactedBy,
								user.username
							]
						}
					}
				}

				const data = {
					newReactions,
					postId: postState.postId
				}

				const sendNewReactions = await fetch(
					`${URL}/api/posts/updatereactions/${userID}`,
					{
						method: "POST",
						credentials: "include",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(data)
					}
				)

				if (sendNewReactions.ok) {
					const { newReactions } = await sendNewReactions.json()
					setPostState({
						...postState,
						reactions: newReactions
					})
				} else {
					console.log("Error al actualizar reacción.")
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	async function deletePost() {
		try {
			dialogRef.current?.showModal()
			const sendDelete = await fetch(`${URL}/api/posts/deletepost/${user.id}`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ postId: post.postId })
			})

			if (sendDelete.ok) {
				setDeleting("Post eliminado")
				const { newPosts } = await sendDelete.json()
				dispatch(setPosts(newPosts))
			} else {
				const { message } = await sendDelete.json()
				setDeleting(message[0])
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log(error)
				throw new Error(error.message)
			}
		}
	}

	const haveOptions = user.username === author

	return (
		<>
			<section className="border border-slate-500 rounded-md w-11/12 sm:w-120 relative polygon">
				<div className="text-xl bg-slate-100 p-2 flex justify-between items-center rounded-t-md border-b border-slate-500">
					<span className="font-bold">{author}</span>
					{user.logged && haveOptions ? (
						<div className="flex justify-center items-center gap-x-2 relative">
							<span className="">{post.date}</span>
							<button
								className="w-[15px] cursor-pointer flex justify-center"
								onClick={() => setPostOptionsActive(!postOptionsActive)}
								ref={optionsRef}
							>
								<img
									className="w-2/4"
									src="/ellipsis-vertical-solid.svg"
									alt="Botón menú para modificar post"
								/>
							</button>
							<div
								className={`${
									postOptionsActive ? "block" : "hidden"
								} absolute top-0 right-6 p-2 text-base flex flex-col gap-y-3 bg-white border-2 border-orange-900 rounded-md`}
							>
								<div className="cursor-pointer flex justify-center items-center gap-x-2 p-1 rounded-md border border-teal-500 bg-teal-200 hover:bg-teal-400">
									<img
										src="/pen-to-square-regular.svg"
										width={20}
										alt="edit post button"
									/>
									<button
										onClick={() =>
											navigate(
												`/edit?userId=${user.id}&postId=${postState.postId}`
											)
										}
									>
										Editar
									</button>
								</div>
								<div className="cursor-pointer flex justify-center items-center gap-x-2 p-1 rounded-md border border-red-500 bg-red-300 hover:bg-red-400">
									<img
										src="/trash-solid.svg"
										width={20}
										alt="delete post button"
									/>
									<button onClick={deletePost}>Eliminar</button>
								</div>
							</div>
						</div>
					) : (
						<span className="">{post.date}</span>
					)}
				</div>
				<div className="font-mono text-xl text-cyan-950 p-2 rounded-b-md flex flex-col gap-y-6">
					<p className="text-2xl font-sans font-semibold">{post.title}</p>
					<div
						className="text-base font-serif font-medium break-words"
						dangerouslySetInnerHTML={{ __html: post.body }}
					></div>
					<div className="flex items-center gap-x-6">
						<details
							className="w-fit relative"
							open={isOpen}
							ref={detailsRef}
							onToggle={(e) => setIsOpen(e.currentTarget.open)}
							onClick={(e) => {
								if (!user.logged) e.preventDefault()
							}}
						>
							<summary className="list-none">
								<img
									src="/emoji.svg"
									alt="Emoji"
									width="25"
									height="25"
									className="cursor-pointer"
								/>
							</summary>
							<div className="flex justify-between items-center gap-x-4 p-2 absolute -top-14 left-0 text-base bg-white py-0.5 px-1.5 border border-slate-500 rounded-md">
								<button
									className="cursor-pointer py-[2px] px-[5px] hover:bg-slate-200 rounded-md"
									onClick={handleClickReactionOne}
									name="thumbsUp"
								>
									👍
								</button>
								<button
									className="cursor-pointer py-[2px] px-[5px] hover:bg-slate-200 rounded-md"
									onClick={handleClickReactionOne}
									name="thumbsDown"
								>
									👎
								</button>
								<button
									className="cursor-pointer py-[2px] px-[5px] hover:bg-slate-200 rounded-md"
									onClick={handleClickReactionOne}
									name="smile"
								>
									😄
								</button>
								<button
									className="cursor-pointer py-[2px] px-[5px] hover:bg-slate-200 rounded-md"
									onClick={handleClickReactionOne}
									name="hooray"
								>
									🎉
								</button>
								<button
									className="cursor-pointer py-[2px] px-[5px] hover:bg-slate-200 rounded-md"
									onClick={handleClickReactionOne}
									name="unhappy"
								>
									😕
								</button>
								<button
									className="cursor-pointer py-[2px] px-[5px] hover:bg-slate-200 rounded-md"
									onClick={handleClickReactionOne}
									name="heart"
								>
									💖
								</button>
							</div>
						</details>
						<div
							className={`flex justify-between items-center gap-x-2 text-base font-bold ${
								flag ? "hidden" : "block"
							}`}
						>
							<div className="relative" id={`thumbsUp-reaction`}>
								<button
									className={`cursor-pointer tracking-[0.5em] p-0.5 rounded-xl px-1 ${
										thumbsUp.count > 0 ? "block" : "hidden"
									} border ${
										thumbsUpReacted
											? "border-blue-700 bg-blue-100 hover:bg-blue-200"
											: "border-slate-300 bg-white hover:bg-slate-200"
									}`}
									onClick={handleClickReactionOne}
									name="thumbsUp"
									ref={thumbsUpRef}
								>
									👍{thumbsUp.count}
								</button>
								<div
									className={`tooltip absolute w-48 -top-2 left-0 sm:left-2/4 -translate-y-full sm:-translate-x-2/4 sm:after:-ml-[5px] after:-ml-[60px] p-2 rounded-xl text-xs text-center text-white bg-slate-800 ${
										thumbsUp.count > 0 ? "block" : "hidden"
									}`}
									data-tip="thumbsUp"
									id={`tooltip-thumbsUp`}
								>
									<p>{reactionsList.thumbsUp.text}</p>
									<p>
										{thumbsUp.count === 1
											? "ha reaccionado con emoji de 'Me gusta' a este post"
											: thumbsUp.count > 1 && thumbsUp.count < 8
											? "han reaccionado con emoji de 'Me gusta' a este post"
											: `y ${reactionsList.thumbsUp.spare} más han reaccionado con emoji de 'Me gusta' a este post`}
									</p>
								</div>
							</div>
							<div className="relative" id={`thumbsDown-reaction`}>
								<button
									className={`cursor-pointer tracking-[0.5em] p-0.5 rounded-xl px-1 ${
										thumbsDown.count > 0 ? "block" : "hidden"
									} border ${
										thumbsDownReacted
											? "border-blue-700 bg-blue-100 hover:bg-blue-200"
											: "border-slate-300 bg-white hover:bg-slate-200"
									}`}
									onClick={handleClickReactionOne}
									name="thumbsDown"
									ref={thumbsDownRef}
								>
									👎{thumbsDown.count}
								</button>
								<div
									className={`tooltip absolute w-48 -top-2 left-2/4 -translate-y-full -translate-x-2/4 p-2 rounded-xl text-xs text-center text-white bg-slate-800 ${
										thumbsDown.count > 0 ? "block" : "hidden"
									}`}
									data-tip="thumbsDown"
									id={`tooltip-thumbsDown`}
								>
									<p>{reactionsList.thumbsDown.text}</p>
									<p>
										{thumbsDown.count === 1
											? "ha reaccionado con emoji de 'No me gusta' a este post"
											: thumbsDown.count > 1 && thumbsDown.count < 8
											? "han reaccionado con emoji de 'No me gusta' a este post"
											: `y ${reactionsList.thumbsDown.spare} más han reaccionado con emoji de 'No me gusta' a este post`}
									</p>
								</div>
							</div>
							<div className="relative" id={`smile-reaction`}>
								<button
									className={`cursor-pointer tracking-[0.5em] p-0.5 rounded-xl px-1 ${
										smile.count > 0 ? "block" : "hidden"
									} border ${
										smileReacted
											? "border-blue-700 bg-blue-100 hover:bg-blue-200"
											: "border-slate-300 bg-white hover:bg-slate-200"
									}`}
									onClick={handleClickReactionOne}
									name="smile"
									ref={smileRef}
								>
									😄{smile.count}
								</button>
								<div
									className={`tooltip absolute w-48 -top-2 left-2/4 -translate-y-full -translate-x-2/4 p-2 rounded-xl text-xs text-center text-white bg-slate-800 ${
										smile.count > 0 ? "block" : "hidden"
									}`}
									data-tip="smile"
									id={`tooltip-smile`}
								>
									<p>{reactionsList.smile.text}</p>
									<p>
										{smile.count === 1
											? "ha reaccionado con emoji de 'Me divierte' a este post"
											: smile.count > 1 && smile.count < 8
											? "han reaccionado con emoji de 'Me divierte' a este post"
											: `y ${reactionsList.smile.spare} más han reaccionado con emoji de 'Me divierte' a este post`}
									</p>
								</div>
							</div>
							<div className="relative" id={`hooray-reaction`}>
								<button
									className={`cursor-pointer tracking-[0.5em] p-0.5 rounded-xl px-1 ${
										hooray.count > 0 ? "block" : "hidden"
									} border ${
										hoorayReacted
											? "border-blue-700 bg-blue-100 hover:bg-blue-200"
											: "border-slate-300 bg-white hover:bg-slate-200"
									}`}
									onClick={handleClickReactionOne}
									name="hooray"
									ref={hoorayRef}
								>
									🎉{hooray.count}
								</button>
								<div
									className={`tooltip absolute w-48 -top-2 left-2/4 -translate-y-full -translate-x-2/4 p-2 rounded-xl text-xs text-center text-white bg-slate-800 ${
										hooray.count > 0 ? "block" : "hidden"
									}`}
									data-tip="hooray"
									id={`tooltip-hooray`}
								>
									<p>{reactionsList.hooray.text}</p>
									<p>
										{hooray.count === 1
											? "ha reaccionado con emoji de 'Felicidades' a este post"
											: hooray.count > 1 && hooray.count < 8
											? "han reaccionado con emoji de 'Felicidades' a este post"
											: `y ${reactionsList.hooray.spare} más han reaccionado con emoji de 'Felicidades' a este post`}
									</p>
								</div>
							</div>
							<div className="relative" id={`unhappy-reaction`}>
								<button
									className={`cursor-pointer tracking-[0.5em] p-0.5 rounded-xl px-1 ${
										unhappy.count > 0 ? "block" : "hidden"
									} border ${
										unhappyReacted
											? "border-blue-700 bg-blue-100 hover:bg-blue-200"
											: "border-slate-300 bg-white hover:bg-slate-200"
									}`}
									onClick={handleClickReactionOne}
									name="unhappy"
									ref={unhappyRef}
								>
									😕{unhappy.count}
								</button>
								<div
									className={`tooltip absolute w-48 -top-2 left-2/4 -translate-y-full -translate-x-2/4 p-2 rounded-xl text-xs text-center text-white bg-slate-800 ${
										unhappy.count > 0 ? "block" : "hidden"
									}`}
									data-tip="unhappy"
									id={`tooltip-unhappy`}
								>
									<p>{reactionsList.unhappy.text}</p>
									<p>
										{unhappy.count === 1
											? "ha reaccionado con emoji de 'Me entristece' a este post"
											: unhappy.count > 1 && unhappy.count < 8
											? "han reaccionado con emoji de 'Me entristece' a este post"
											: `y ${reactionsList.unhappy.spare} más han reaccionado con emoji de 'Me entristece' a este post`}
									</p>
								</div>
							</div>
							<div className="relative" id={`heart-reaction`}>
								<button
									className={`cursor-pointer tracking-[0.5em] p-0.5 rounded-xl px-1 ${
										heart.count > 0 ? "block" : "hidden"
									} border ${
										heartReacted
											? "border-blue-700 bg-blue-100 hover:bg-blue-200"
											: "border-slate-300 bg-white hover:bg-slate-200"
									}`}
									onClick={handleClickReactionOne}
									name="heart"
									ref={heartRef}
								>
									💖{heart.count}
								</button>
								<div
									className={`tooltip absolute w-48 -top-2 right-0 sm:left-2/4 -translate-y-full sm:-translate-x-2/4 sm:after:-ml-[5px] after:ml-[50px] p-2 rounded-xl text-xs text-center text-white bg-slate-800 ${
										heart.count > 0 ? "block" : "hidden"
									}`}
									data-tip="heart"
									id={`tooltip-heart`}
								>
									<p>{reactionsList.heart.text}</p>
									<p>
										{heart.count === 1
											? "ha reaccionado con emoji de 'Me encanta' a este post"
											: heart.count > 1 && heart.count < 8
											? "han reaccionado con emoji de 'Me encanta' a este post"
											: `y ${reactionsList.heart.spare} más han reaccionado con emoji de 'Me encanta' a este post`}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="sm:block hidden absolute top-[5px] -left-[50px]">
					<div
						style={profileStyle}
						className={`bg-center bg-cover w-[30px] h-[30px] rounded-full`}
					></div>
				</div>
			</section>
			<dialog
				ref={dialogRef}
				className="fixed m-0 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[45vw] h-[25vh] bg-red-200"
			>
				<div className="w-full h-full flex flex-col justify-center items-center border-2 border-red-500 rounded-md">
					<p
						className={`${
							deleting === "Eliminando..." ? "text-red-500" : "text-black"
						} font-semibold text-3xl`}
					>
						{deleting}
					</p>
					<button
						onClick={() => {
							dialogRef.current?.close()
							setDeleting("Eliminando...")
							const x = postsOrdered.filter(
								(postOrdered) => postOrdered.postId !== post.postId
							)
							setPostsOrdered(x)
						}}
						className={`absolute top-2 right-2 text-xs bg-neutral-700 hover:bg-neutral-900 rounded-full w-7 h-7 ${
							deleting === "Eliminando..." ? "hidden" : "block"
						}`}
					>
						✖
					</button>
				</div>
			</dialog>
		</>
	)
}
