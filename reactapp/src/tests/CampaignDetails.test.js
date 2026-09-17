import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as api from "../utils/api";
import CampaignDetails from "../components/CampaignDetails";
jest.mock("../utils/api");

const campaign = {
  id: 3,
  title: "Sample Campaign",
  description: "A detailed sample campaign desc...",
  goalAmount: 1000.0,
  currentAmount: 120.0,
  deadline: "2023-12-15",
  category: "Environment",
  creatorName: "Jane",
  createdAt: "2023-05-03T12:05:00",
  status: "ACTIVE",
  donations: [
    {
      id: 1,
      amount: 50.0,
      donorName: "Alice",
      donatedAt: "2023-05-04T10:00:00",
      message: "Great work!"
    }
  ]
};

describe("CampaignDetails", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    api.fetchCampaignById.mockResolvedValue(campaign);
    api.fetchDonations.mockResolvedValue(campaign.donations);
  });

  const renderComponent = () => {
    window.history.pushState({}, "", "/campaign/3");
    return render(
      <MemoryRouter initialEntries={["/campaign/3"]}>
        <Routes>
          <Route path="/campaign/:id" element={<CampaignDetails />} />
        </Routes>
      </MemoryRouter>
    );
};

  it("State_renders campaign details, donations list, and donation form", async () => {
    renderComponent();
    expect(screen.getByText(/loading campaign/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(campaign.title)).toBeInTheDocument();
    });
    // Move rest outside of waitFor to satisfy single assertion per waitFor
    expect(screen.getByText("A detailed sample campaign desc...")).toBeInTheDocument();
    expect(screen.getByText("Donations")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByTestId("donation-amount")).toBeInTheDocument();
    expect(screen.getByTestId("donorName-input")).toBeInTheDocument();
    expect(screen.getByTestId("donation-message")).toBeInTheDocument();
    expect(screen.getByTestId("donate-submit")).toBeEnabled();
  });

  it("State_disables donation form if campaign is not ACTIVE", async () => {
    api.fetchCampaignById.mockResolvedValueOnce({ ...campaign, status: "EXPIRED" });
    renderComponent();
    await screen.findByText(/expired/i);
    expect(screen.getByTestId("donation-amount")).toBeDisabled();
    expect(screen.getByTestId("donorName-input")).toBeDisabled();
    expect(screen.getByTestId("donation-message")).toBeDisabled();
    expect(screen.getByTestId("donate-submit")).toBeDisabled();
  });

  it("ErrorHandling_validates donation form and handles API error", async () => {
    api.makeDonation.mockRejectedValueOnce({ response: { data: { message: "API error!" } } });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(campaign.title)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("donation-amount"), { target: { value: "0" } });
    fireEvent.change(screen.getByTestId("donorName-input"), { target: { value: "" } });
    fireEvent.click(screen.getByTestId("donate-submit"));
    expect(await screen.findByTestId("donate-error")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("donation-amount"), { target: { value: "20" } });
    fireEvent.change(screen.getByTestId("donorName-input"), { target: { value: "Emily" } });
    fireEvent.click(screen.getByTestId("donate-submit"));
    await waitFor(() => {
      expect(screen.getByTestId("donate-error")).toHaveTextContent("API error!");
    });
  });
});
