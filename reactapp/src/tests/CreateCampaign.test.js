import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CreateCampaign from "../components/CreateCampaign";
import * as api from "../utils/api";

jest.mock("../utils/api");

describe("CreateCampaign", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup() {
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/campaign/:id" element={<div>Campaign Details Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("State_renders all form fields with initial state", () => {
    setup();
    expect(screen.getByLabelText(/Title/i)).toHaveValue("");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("");
    expect(screen.getByLabelText(/Goal amount/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Deadline/i)).toHaveValue("");
    expect(screen.getByLabelText(/Category/i)).toHaveValue("");
    expect(screen.getByLabelText(/Creator name/i)).toHaveValue("");
    expect(screen.getByTestId("submit-button")).not.toBeDisabled();
    expect(Array.from(screen.getByTestId("category-select").options).length).toBeGreaterThan(1);
  });

  it("State_shows validation errors on empty submit", async () => {
    setup();
    fireEvent.click(screen.getByTestId("submit-button"));
    // Instead of findByText (which gets first), check all by text for required fields
    const reqErrors = await screen.findAllByText(/This field is required./i);
    expect(reqErrors.length).toBeGreaterThan(1);
    // Check that the title has error styling:
    const titleInput = screen.getByLabelText(/Title/i);
    expect(titleInput.classList.contains('error')).toBe(true);
  });

  it("State_shows validation error for short title and description", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Help" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Short desc!" } });
    fireEvent.change(screen.getByLabelText(/Goal amount/i), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText(/Deadline/i), { target: { value: "2023-01-01" } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Animals" } });
    fireEvent.change(screen.getByLabelText(/Creator name/i), { target: { value: "" } });
    fireEvent.click(screen.getByTestId("submit-button"));
    const titleError = screen.queryByText(text => typeof text === "string" && text.includes('Title must be 5-100 characters'));
    const descError = screen.queryByText(text => typeof text === "string" && text.includes('Description must be 20-500 characters'));
    const goalError = screen.queryByText(text => typeof text === "string" && text.includes('Goal amount must be at least 100.00'));
    const dateError = screen.queryByText(text => typeof text === "string" && text.includes('Deadline must be a future date'));
    expect(titleError).not.toBeNull();
    expect(descError).not.toBeNull();
    expect(goalError).not.toBeNull();
    expect(dateError).not.toBeNull();
    expect(screen.getByText(/This field is required./i)).toBeInTheDocument(); // creatorName missing
  });

  it("State_shows error if deadline is not a future date", async () => {
    setup();
    const yesterday = new Date(Date.now()-86400000).toISOString().split("T")[0];
    fireEvent.change(screen.getByLabelText(/Deadline/i), { target: { value: yesterday } });
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(await screen.findByText(/Deadline must be a future date/)).toBeInTheDocument();
  });

  it("Axios_successfully creates a campaign and redirects", async () => {
    setup();
    const today = new Date();
    const future = new Date(today.setDate(today.getDate()+2)).toISOString().split("T")[0];
    api.createCampaign.mockResolvedValueOnce({
      id: 123,
      title: "T",
    });
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Big Help Fund" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "This is a very helpful campaign for testing the form." } });
    fireEvent.change(screen.getByLabelText(/Goal amount/i), { target: { value: "1500" } });
    fireEvent.change(screen.getByLabelText(/Deadline/i), { target: { value: future } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Community" } });
    fireEvent.change(screen.getByLabelText(/Creator name/i), { target: { value: "Unit Tester" } });
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(screen.getByTestId("submit-button")).toBeDisabled();
    await waitFor(() => {
      expect(api.createCampaign).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText(/Campaign Details Page/)).toBeInTheDocument();
    });
  });

  it("State_shows backend error if API returns error", async () => {
    setup();
    api.createCampaign.mockRejectedValueOnce({
      response: { data: { message: "Title already exists." } },
    });
    const today = new Date();
    const future = new Date(today.setDate(today.getDate()+2)).toISOString().split("T")[0];
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Duplicate" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "A unique campaign for error." } });
    fireEvent.change(screen.getByLabelText(/Goal amount/i), { target: { value: "2000" } });
    fireEvent.change(screen.getByLabelText(/Deadline/i), { target: { value: future } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Education" } });
    fireEvent.change(screen.getByLabelText(/Creator name/i), { target: { value: "Testing" } });
    fireEvent.click(screen.getByTestId("submit-button"));
    expect(screen.getByTestId("submit-button")).toBeDisabled();
    await waitFor(() => {
      expect(screen.getByText(/Title already exists./)).toBeInTheDocument();
    });
  });
});
