```javascript
/**
 * Jest unit tests for the schedule route and controller logic.
 * Tests focus on the API contract and business logic, using a lightweight Express app.
 */
import request from 'supertest';
import express from 'express';
import scheduleRouter from '../routes/schedule';
import { createSchedule, getSchedules, updateSchedule } from '../controllers/schedule';
import { validateScheduleInput, validateUpdateInput } from '../utils/validation';

// Mock controller functions
jest.mock('../controllers/schedule', () => ({
  createSchedule: jest.fn(),
  getSchedules: jest.fn(),
  updateSchedule: jest.fn(),
}));

// Mock validation utilities
jest.mock('../utils/validation', () => ({
  validateScheduleInput: jest.fn((req) => ({
    body: req.body,
    isValid: true,
  })),
  validateUpdateInput: jest.fn((req) => ({
    params: req.params,
    isValid: true,
  })),
}));

const app = express();
app.use(express.json());
app.use('/schedules', scheduleRouter);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Schedule API', () => {
  it('POST /schedules creates a new schedule', async () => {
    const mockBody = {
      subject: 'Follow‑up Reminder',
      recipient: 'test@example.com',
      sent_at: '2023-10-01T09:00:00Z',
      interval_minutes: 120,
      reminder_text: 'Checking in',
    };

    const mockResponse = {
      id: 'schedule-123',
      subject: mockBody.subject,
      recipient: mockBody.recipient,
      scheduled_at: '2023-10-02T09:00:00Z',
      status: 'pending',
      reminder_text: mockBody.reminder_text,
    };

    createSchedule.mockResolvedValueOnce(mockResponse);

    const response = await request(app)
      .post('/schedules')
      .send(mockBody)
      .expect(201);

    expect(response.body).toMatchObject({
      id: 'schedule-123',
      subject: 'Follow‑up Reminder',
      recipient: 'test@example.com',
      status: 'pending',
    });

    expect(createSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Follow‑up Reminder',
        recipient: 'test@example.com',
        scheduled_at: expect.any(String),
        status: 'pending',
      })
    );
  });

  it('GET /schedules returns scheduled reminders', async () => {
    const mockSchedules = [
      {
        id: 's1',
        subject: 'Reminder A',
        scheduled_at: '2023-10-05T08:00:00Z',
        status: 'pending',
      },
    ];

    getSchedules.mockResolvedValueOnce(mockSchedules);

    const response = await request(app).get('/schedules').expect(200);
    expect(response.body).toEqual(mockSchedules);
    expect(getSchedules).toHaveBeenCalled();
  });

  it('PATCH /schedules/:id updates schedule status', async () => {
    const mockParams = { id: 's1' };
    const mockUpdateResponse = { id: 's1', status: 'completed' };

    updateSchedule.mockResolvedValueOnce(mockUpdateResponse);

    const response = await request(app)
      .patch(`/schedules/${mockParams.id}`)
      .send({ status: 'completed' })
      .expect(200);

    expect(response.body).toEqual(mockUpdateResponse);
    expect(updateSchedule).toHaveBeenCalledWith('s1', { status: 'completed' });
  });
});
```