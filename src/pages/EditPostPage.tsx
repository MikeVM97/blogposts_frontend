import { useState, useEffect } from "react"

import { Link, useLocation, useNavigate } from "react-router-dom"

import { useAppSelector, useAppDispatch } from "store/hook"
import type { RootState } from "store/store"
import { setPosts } from "reducers/userSlice"

import ReactQuill, { Quill } from "react-quill"
// @ts-ignore
import quillEmoji from "quill-emoji"
import "react-quill/dist/quill.snow.css"
import "quill-emoji/dist/quill-emoji.css"

import { URL } from "constants/index"

Quill.register(
	{
		"formats/emoji": quillEmoji.EmojiBlot,
		"modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
		"modules/emoji-textarea": quillEmoji.TextAreaEmoji,
		"modules/emoji-shortname": quillEmoji.ShortNameEmoji
	},
	true
)

const template = {
	title: "",
	body: ""
}

interface EditPost {
	title: string
	body: string
}

export default function EditPostPage() {
	const [post, setPost] = useState<EditPost>(template)
	const [value, setValue] = useState("")
	const [loader, setLoader] = useState(false)
	const [showAlert, setShowAlert] = useState(false)
	const [errorMessages, setErrorMessages] = useState<string[]>([])
	const [statusMessage, setStatusMessage] = useState("failed")
	const [newPosts, setNewPosts] = useState([])

	const formats = [
		"font",
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"code-block",
		"color",
		"background",
		"list",
		"indent",
		"align",
		"link",
		"image",
		"clean",
		"emoji"
	]
	const modules = {
		toolbar: [
			["bold", "italic", "underline", "strike"],
			["blockquote", "code-block"],

			[{ header: 1 }, { header: 2 }],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ script: "sub" }, { script: "super" }],
			[{ indent: "-1" }, { indent: "+1" }],

			[{ size: ["small", false, "large", "huge"] }],
			[{ header: [1, 2, 3, 4, 5, 6, false] }],

			[{ color: [] }, { background: [] }],
			[{ font: [] }],
			[{ align: [] }],

			["clean"]
		],
		"emoji-textarea": true,
		"emoji-shortname": true
	}

	useEffect(() => {
		const emojiContainer = document.querySelector(
			"#textarea-emoji"
		) as HTMLElement
		function handleClickOutside(e: MouseEvent) {
			if (emojiContainer && !emojiContainer?.contains(e.target as Node)) {
				emojiContainer.style.display = "none"
			}
		}
		document.addEventListener("click", handleClickOutside)
		return () => {
			document.removeEventListener("click", handleClickOutside)
		}
	}, [])

	const user = useAppSelector((state: RootState) => state.user)
	const dispatch = useAppDispatch()

	const navigate = useNavigate()

	const location = useLocation()
	const queryParams = new URLSearchParams(location.search)
	const postId = queryParams.get("postId")

	const postFound: Post = user.posts.find(
		(post: Post) => post.postId === postId
	) as Post
	useEffect(() => {
		setPost({
			title: postFound.title,
			body: postFound.body
		})
		setValue(postFound.body)
	}, [postFound.body, postFound.title])

	const Alert_Component = (
		<div
			className={`${
				showAlert ? "block" : "hidden"
			} absolute p-4 bg-gray-200 w-full h-full flex flex-col justify-center items-center`}
		>
			<div
				className={`${
					statusMessage === "failed" ? "border-red-500" : "border-green-500"
				} py-8 px-4 border-2 relative w-auto max-w-[60%]`}
			>
				{statusMessage === "failed" ? (
					<ul className="list-none text-xl">
						{errorMessages.map((message, index) => (
							<li className="text-red-500 font-semibold font-serif" key={index}>
								{message}
							</li>
						))}
					</ul>
				) : (
					<div className="text-xl text-green-500 font-serif flex flex-col gap-y-8">
						<p className="text-2xl font-semibold">¡ Post actualizado !</p>
					</div>
				)}

				<button
					className={`absolute top-1 right-1 text-lg font-bold bg-neutral-700 hover:text-black ${
						statusMessage === "failed"
							? "text-red-500  hover:bg-red-500"
							: "text-green-500 hover:bg-green-500"
					} rounded-full w-7 h-7 `}
					onClick={() => {
						setShowAlert(false)
						if (statusMessage !== "failed") {
							dispatch(setPosts(newPosts))
							navigate("/")
						}
					}}
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
			const postData = {
				...post,
				postId
			}
			const sendForm = await fetch(`${URL}/api/posts/updatepost/${user.id}`, {
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(postData)
			})

			if (sendForm.ok) {
				setLoader(false)
				setStatusMessage("success")
				setShowAlert(true)
				const { newPosts } = await sendForm.json()
				setNewPosts(newPosts)
			} else {
				setLoader(false)
				setStatusMessage("failed")
				const { message } = await sendForm.json()
				setErrorMessages(message)
				setShowAlert(true)
			}
		} catch (error) {
			setLoader(false)
			if (error instanceof Error) {
				console.log(error)
			}
		}
	}

	const newChanges =
		postFound.title !== post.title || postFound.body !== post.body

	return (
		<div className="w-screen h-screen flex items-center justify-center relative bg-gray-200">
			<form
				className={`border-2 rounded-xl border-gray-900 flex flex-col gap-y-1 p-4 basis-96 text-xl h-auto bg-slate-200 ${
					loader || showAlert ? "hidden" : "block"
				}`}
				onSubmit={handleSubmit}
			>
				<label className="opacity-50" htmlFor="post-title">
					Título:
				</label>
				<input
					className="border border-gray-600 mb-4 p-1"
					id="post-title"
					type="text"
					value={post.title}
					onChange={(e) => {
						setPost({
							...post,
							title: e.target.value
						})
					}}
					required
				/>
				<label className="opacity-50" htmlFor="post-body">
					Mensaje:
				</label>
				<ReactQuill
					theme="snow"
					value={value}
					formats={formats}
					onChange={(n) => {
						setPost({
							...post,
							body: n
						})
						setValue(n)
					}}
					modules={modules}
				/>
				<button
					className={`border-2 rounded-md w-1/2 m-auto p-1 text-2xl ${
						!newChanges
							? "border-zinc-500 bg-zinc-300"
							: "border-green-500 bg-green-300 hover:bg-green-500"
					}`}
					type="submit"
					disabled={!newChanges}
				>
					Editar post
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
				<h3 className="text-xl font-bold font-mono">Actualizando post...</h3>
				<div className="spinner"></div>
			</div>
		</div>
	)
}
