import { string, object, minLength, maxLength, email, regex, type Output } from "valibot";

export const RegisterSchema = object({
  email: string([
    minLength(1, "Se requiere almenos 1 caracter."),
    email("Ingrese un email válido."),
  ]),
  gender: string(),
  password: string([
    minLength(7, "La contraseña es demasiado corta."),
    maxLength(16, "La contraseña es demasiado larga."),
    regex(/^[A-Z0-9]+$/i, "La contraseña solo puede tener letras y números."),
  ]),
  username: string([
    minLength(3, "El nombre de usuario es demasiado corto."),
    maxLength(12, "El nombre de usuario es demasiado largo."),
    regex(/^[A-Z0-9]+$/i, "El nombre de usuario solo puede tener letras y números."),
  ]),
});

export type RegisterData = Output<typeof RegisterSchema>;