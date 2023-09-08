# BlogPosts con React + Typescript

Librerías:
- Valibot
- bscryptjs
- react-router-dom
- uuid (x)
- nodemailer (x)
- firebase
- tailwindcss
- postcss
- autoprefixer
- date-fns
- react-redux
- @reduxjs/toolkit
- redux-persist
- socket.io-client

Para TDD:
- jest
- ts-jest
- @types/jest
- @testing-library/react
- @testing-library/user-event
- @testing-library/jest-dom
- jest-environment-jsdom
- identity-obj-proxy

SPRINT:

- Crear Landing Page con todos los Posts de los usuarios y dos botones (login y register). ✅
- Crear 2 formularios (FormLogin, FormRegister). ✅
- Crear rutas para cada página utilizando react-router-dom. ✅

- La aplicación debe poder registrar nuevos usuarios con los campos requeridos:
  email, password, password de confirmación, género y username. ✅
- La aplicación debe poder loguear usuarios con los campos requeridos: email y password. ✅

- Los usuarios deben poder cargar una foto de perfil. ✅
- Se utiliza un CMS como Firebase Storage o DigitalOcean Spaces para almacenar y servir la foto de perfil. ✅

- La sesión del usuario lo maneja el backend con JWT. ✅
- El estado del usuario es manejado con redux. ✅
- Algunas páginas son protegidas en base al estado "logged" del usuario. ✅

- Los usuarios deben poder crear nuevos Posts. ✅
- Los usuarios deben poder editar los Posts. 
- Los usuarios deben poder eliminar los Posts. 

- Los posts deben ser reaccionables (like, dislike, etc). Solo se puede reaccionar 1 vez por usuario. ✅
- Las reacciones hechas, deben poder tener un efecto reversivo, por ejemplo, un usuario puede dar
like a un botón pero también puede quitar la reacción de like, si así lo deseara. ✅
- Las reacciones deben mostrarse de un color diferente cuando el usuario logueado ya ha reaccionado
a éste y de otro color cuando el usuario logueado no ha reaccionado a éste. ✅
- Los botones de reacción deben mostrar un tooltip cuando se hace hover sobre el botón. ✅
- El tooltip debe mostrar los nombres de usuarios que reaccionaron al post. ✅

- La aplicación no debe permitir ciertas acciones si el usuario aún no ha confirmado su cuenta. ✅
- El backend se encarga de verificar si el usuario ha confirmado o no su cuenta. ✅
- El usuario no puede empezar a realizar Posts si no ha confirmado su cuenta. ✅

- Se debe realizar pruebas unitarias utilizando Jest. 