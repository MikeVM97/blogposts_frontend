import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function UserIsLogged() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  });
  return (
    <p>PARA INGRESAR A ESTA PÁGINA PRIMERO NECESITA CERRAR SESIÓN.</p>
  );
}