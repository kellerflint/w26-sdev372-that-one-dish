import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddDish from "../components/AddDish";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();
global.alert = jest.fn();

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("AddDish", () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    alert.mockClear();
  });

  it("submits form successfully", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AddDish />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Cheese Burger/i), "Burger");
    // Filling out required Restaurant Name to ensure form validation passes
    await user.type(screen.getByPlaceholderText(/e.g. That One Place/i), "The Burger Joint");
    
    await user.click(screen.getByRole("button", { name: /Add to Gallery/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(alert).toHaveBeenCalledWith("Dish added successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error if request fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AddDish />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Cheese Burger/i), "Burger");
    // Filling out required Restaurant Name to ensure form validation passes
    await user.type(screen.getByPlaceholderText(/e.g. That One Place/i), "The Burger Joint");

    await user.click(screen.getByRole("button", { name: /Add to Gallery/i }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(
        "Error adding dish. Check if backend is running on port 3000!"
      );
    });

    consoleSpy.mockRestore(); // restore normal behavior after test
  });
});