```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Popup } from '../src/popup.jsx';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Popup Component', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
  });

  it('renders form fields', () => {
    render(<Popup />);
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interval/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delay/i)).toBeInTheDocument();
  });

  it('submits the form and displays a success toast', async () => {
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({ data: { message: 'Scheduled' } });

    render(<Popup />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: 'Test Subject' },
    });
    fireEvent.change(screen.getByLabelText(/recipient/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/interval/i), {
      target: { value: '60' },
    });

    // Submit
    fireEvent.click(screen.getByText(/schedule/i));

    // Wait for toast to appear
    await waitFor(() => {
      expect(screen.getByText(/scheduled successfully/i)).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/schedules',
      expect.objectContaining({
        subject: 'Test Subject',
        recipient: 'test@example.com',
        interval_minutes: 60,
      })
    );
  });

  it('shows error toast when API fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<Popup />);

    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: 'Subject' },
    });
    fireEvent.change(screen.getByLabelText(/recipient/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/interval/i), {
      target: { value: '30' },
    });
    fireEvent.click(screen.getByText(/schedule/i));

    await waitFor(() => {
      expect(screen.getByText(/failed to schedule/i)).toBeInTheDocument();
    });
  });
});
```