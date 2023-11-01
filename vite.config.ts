/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom"
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./", import.meta.url)),
			pages: fileURLToPath(new URL("./src/pages/", import.meta.url)),
			components: fileURLToPath(new URL("./src/components/", import.meta.url)),
			schemas: fileURLToPath(new URL("./src/schemas/", import.meta.url)),
			api: fileURLToPath(new URL("./src/api/", import.meta.url)),
			reducers: fileURLToPath(new URL("./src/reducers/", import.meta.url)),
			constants: fileURLToPath(new URL("./src/constants/", import.meta.url))
		}
	}
})
