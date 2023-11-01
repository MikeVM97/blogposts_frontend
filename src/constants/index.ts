export const URL =
	process.env.NODE_ENV === "production"
		? import.meta.env.VITE_HOST
		: "http://localhost:3000"
