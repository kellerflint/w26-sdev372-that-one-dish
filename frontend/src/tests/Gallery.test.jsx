import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import Gallery from "../components/Gallery";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn();

describe("Gallery", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("shows placeholder when no dishes", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/No dishes yet/i)).toBeInTheDocument()
    );
  });

  it("renders dishes from API", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          dish_name: "Pizza",
          cuisine: "Italian",
          restaurant_name: "Mario's",
          restaurant_address: "123 Street",
          dish_details: "Cheesy goodness",
          image_url: null,
        },
      ],
    });

    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Pizza")).toBeInTheDocument());
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Cheesy goodness")).toBeInTheDocument();
  });
});