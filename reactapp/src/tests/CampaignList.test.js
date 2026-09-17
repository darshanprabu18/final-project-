import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../utils/api';
import CampaignList from '../components/CampaignList';

jest.mock('../utils/api');

const sampleData = [
  {
    id: 1,
    title: 'Help Local Animal Shelter',
    description: 'Raising funds for animals',
    goalAmount: 5000.00,
    currentAmount: 1200.00,
    deadline: '2023-12-31',
    category: 'Animals',
    creatorName: 'John',
    createdAt: '2023-05-10T12:00:00',
    status: 'ACTIVE'
  },
  {
    id: 2,
    title: 'Community Library',
    description: 'Build a new library',
    goalAmount: 10000.00,
    currentAmount: 500.00,
    deadline: '2023-10-10',
    category: 'Education',
    creatorName: 'Emma',
    createdAt: '2023-05-09T12:00:00',
    status: 'COMPLETED'
  }
];

describe('CampaignList', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('State_renders loading and campaigns', async () => {
    api.fetchCampaigns.mockResolvedValue(sampleData);
    render(
      <MemoryRouter>
        <CampaignList />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading campaigns/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('campaign-card-1')).toBeInTheDocument();
    });
    // Move the second assertion out of waitFor for single assertion policy
    expect(screen.getByTestId('campaign-card-2')).toBeInTheDocument();
  });

  it('State_handles empty state', async () => {
    api.fetchCampaigns.mockResolvedValue([]);
    render(
      <MemoryRouter>
        <CampaignList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/no campaigns found/i)).toBeInTheDocument();
    });
  });

  it('Axios_can filter by category', async () => {
    api.fetchCampaigns.mockResolvedValue(sampleData);
    render(
      <MemoryRouter>
        <CampaignList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('campaign-card-1')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('category-filter'), {
      target: { value: 'Animals' }
    });
    await waitFor(() => {
      expect(api.fetchCampaigns).toHaveBeenCalledWith({ category: 'Animals', status: undefined });
    });
  });

  it('Axios_can filter by status', async () => {
    api.fetchCampaigns.mockResolvedValue(sampleData);
    render(
      <MemoryRouter>
        <CampaignList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('campaign-card-1')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('status-filter'), {
      target: { value: 'COMPLETED' }
    });
    await waitFor(() => {
      expect(api.fetchCampaigns).toHaveBeenCalledWith({ category: undefined, status: 'COMPLETED' });
    });
  });

  it('State_shows empty campaign state if fetch fails', async () => {
    api.fetchCampaigns.mockRejectedValue(new Error('fail'));
    render(
      <MemoryRouter>
        <CampaignList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/no campaigns found/i)).toBeInTheDocument();
    });
  });
});
