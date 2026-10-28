```javascript
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { body, param, validationResult } = require('express-validator');
const { createSchedule, getSchedules, updateSchedule } = require('../controllers/schedule');
const { validateScheduleInput, validateUpdateInput } = require('../utils/validation');

/**
 * POST /schedules
 * Body: { subject, recipient, sent_at (ISO string), interval_minutes (number), reminder_text }
 */
router.post(
  '/',
  validateScheduleInput,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, recipient, sent_at, interval_minutes, reminder_text } = req.body;

    // Compute scheduled_at timestamp
    const sentDate = new Date(sent_at);
    const scheduledDate = new Date(sentDate.getTime() + interval_minutes * 60 * 1000);

    const schedule = await createSchedule({
      subject,
      recipient,
      sent_at: sentDate,
      scheduled_at: scheduledDate,
      reminder_text,
      status: 'pending',
    });

    res.status(201).json(schedule);
  })
);

/**
 * GET /schedules
 * Returns all scheduled follow‑ups for the logged‑in user (user id could be derived from token)
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const schedules = await getSchedules();
    res.json(schedules);
  })
);

/**
 * PATCH /schedules/:id
 * Body: { status } (e.g., 'completed')
 */
router.patch(
  '/:id',
  validateUpdateInput,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateSchedule(id, { status });

    res.json(updated);
  })
);

module.exports = router;
```