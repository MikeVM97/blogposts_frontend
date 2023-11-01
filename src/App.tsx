// import './App.css';
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "pages/HomePage"
import LoginPage from "pages/LoginPage"
import RegisterPage from "pages/RegisterPage"
import CreatePostPage from "pages/CreatePostPage"
import EditPostPage from "pages/EditPostPage"
import ProfilePage from "pages/ProfilePage"
import { useAppSelector } from "./store/hook"
import { RootState } from "./store/store"
import PublicPage from "./PublicPage"

export default function App() {
	const user = useAppSelector((state: RootState) => state.user)
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route
				path="/login"
				element={!user.logged ? <LoginPage /> : <Navigate to="/" />}
			/>
			<Route
				path="/register"
				element={!user.logged ? <RegisterPage /> : <Navigate to="/" />}
			/>

			<Route
				path="/post"
				element={user.logged ? <CreatePostPage /> : <Navigate to="/" />}
			/>
			<Route
				path="/profile"
				element={user.logged ? <ProfilePage /> : <Navigate to="/" />}
			/>
			<Route
				path="/edit"
				element={user.logged ? <EditPostPage /> : <Navigate to="/" />}
			/>

			<Route path="*" element={<Navigate to="/" replace />} />

			<Route path="/testing-public" Component={PublicPage} />
		</Routes>
	)
}
