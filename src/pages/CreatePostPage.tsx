import { useState, useEffect } from "react"

import { Link, useNavigate } from "react-router-dom"

import { useAppSelector, useAppDispatch } from "store/hook"
import { type RootState } from "store/store"
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

export default function CreatePostPage() {
	const [post, setPost] = useState(template)
	const [value, setValue] = useState("")
	const [loader, setLoader] = useState(false)

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

	const navigate = useNavigate()

	const user = useAppSelector((state: RootState) => state.user)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!user.isVerified) {
			navigate("/")
		}
	}, [user.isVerified, navigate])

	async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
		e.preventDefault()
		setLoader(true)
		try {
			const sendUser = await fetch(`${URL}/api/posts/createpost/${user.id}`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(post)
			})

			if (sendUser.ok) {
				const { newPosts } = await sendUser.json()
				dispatch(setPosts(newPosts))
				setLoader(false)
				navigate("/")
			} else {
				setLoader(false)
			}
		} catch (error) {
			setLoader(false)
			if (error instanceof Error) {
				console.log(error)
				throw new Error(error.message)
			}
		}
	}

	return (
		<div className="w-screen h-screen flex items-center justify-center relative bg-gray-200">
			<form
				className={`border-2 rounded-xl border-gray-900 flex flex-col gap-y-1 p-4 basis-96 text-xl h-auto bg-slate-200 ${
					loader ? "hidden" : "block"
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
					onChange={setValue}
					modules={modules}
				/>
				<button
					className="border-2 rounded-md w-1/2 m-auto p-1 text-2xl border-white text-white bg-zinc-800 hover:bg-white hover:text-zinc-800 hover:border-zinc-800"
					type="submit"
				>
					Crear post
				</button>
			</form>
			<Link
				className="hidden sm:block absolute bottom-4 right-4 text-xl font-semibold p-1 border-2 rounded-md border-green-700 bg-white text-green-900 hover:bg-green-800 hover:text-white"
				to="/"
			>
				👈 Volver
			</Link>
			<div
				className={`${
					loader ? "block" : "hidden"
				} absolute p-4 bg-gray-200 w-full h-full flex flex-col justify-center items-center`}
			>
				<h3 className="text-xl font-bold font-mono">Creando post...</h3>
				<div className="spinner"></div>
			</div>
		</div>
	)
}
