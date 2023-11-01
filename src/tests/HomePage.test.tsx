// import React from "react";
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { describe, it, expect, beforeEach } from "vitest"
import HomePage from "pages/HomePage"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { persistor, store } from "../store/store"
import { PersistGate } from "redux-persist/integration/react"

beforeEach(() => {
	render(
		<BrowserRouter>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<HomePage />
				</PersistGate>
			</Provider>
		</BrowserRouter>
	)
})

describe("App Component works", () => {
	it("some test 1", () => {
		const element = screen.queryByText("BlogPosts")
		expect(element).toBeInTheDocument()
	})
})

// RED => GREEN => REFACTORS
// FALLA => PASA => REFACTORIZAR CODIGO
