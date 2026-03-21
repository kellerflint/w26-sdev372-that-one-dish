import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../components/Header";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders title", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/That One Dish/i)).toBeInTheDocument();
  });
});