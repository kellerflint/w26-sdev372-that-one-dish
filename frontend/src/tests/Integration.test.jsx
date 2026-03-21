import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

global.fetch = jest.fn();
global.alert = jest.fn();

import Header from "../components/Header";
import Gallery from "../components/Gallery";
import AddDish from "../components/AddDish";

describe("App Integration", () => {

  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    fetch.mockClear();

    // suppress error check in terminal
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("user navigates from gallery to add dish and submits", async () => {

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/add-dish" element={<AddDish />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/No dishes yet/i)).toBeInTheDocument()
    );

    // FIX: Changed from getByText("+") to getByAltText(/Add Dish/i) to match the new image icon
    await user.click(screen.getByAltText(/Add Dish/i));

    await waitFor(() =>
      expect(screen.getByText(/Add a New Favorite Dish/i)).toBeInTheDocument()
    );

    await user.type(screen.getByPlaceholderText(/Cheese Burger/i), "Burger");

    await user.type(screen.getByPlaceholderText(/That One Place/i), "Test Restaurant");

    await user.click(screen.getByRole("button", { name: /Add to Gallery/i }));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledTimes(3)
    );
  });

});