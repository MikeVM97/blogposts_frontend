import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../app/store.ts";
import HomePage from "./HomePage";

beforeEach(() =>
  render(
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HomePage />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  )
);

describe("App Component", () => {
  it("It should contains the word BlogPosts", () => {
    expect(screen.queryByText("BlogPosts")).toBeInTheDocument();
  });
});

// RED => GREEN => REFACTORS
// FALLA => PASA => REFACTORIZAR CODIGO
