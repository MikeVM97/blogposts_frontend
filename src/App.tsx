import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import FormLogin from "./components/FormLogin";
import FormRegister from "./components/FormRegister";
import CreatePost from './components/CreatePost';
import UserNotLogged from './components/UserNotLogged';
import UserIsLogged from './components/UserIsLogged';
import { useAppSelector } from './app/hook';
import { RootState } from "./app/store";

export default function App() {
  const user = useAppSelector((state: RootState) => state.user);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="login" Component={!user.logged ? FormLogin : UserIsLogged} />
      <Route path="register" Component={!user.logged ? FormRegister : UserIsLogged} />

      <Route path="post" Component={user.logged ? CreatePost : UserNotLogged} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
