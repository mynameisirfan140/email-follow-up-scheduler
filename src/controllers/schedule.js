```javascript
const { Op } = require('sequelize');
const { Schedule } = require('../models/schedule.model');
const { validateScheduleBody, validateId } = require('../utils/validation');

async function createSchedule(req, res, next) {
  try {
    const payload = validateScheduleBody(req.body);
    const { emailSubject, emailRecipient, emailSentAt, delay, scheduledAt, reminderText } = payload;

    // If reminder text not supplied, generate a placeholder (real app would use AI)
    const reminder = reminderText || await generateReminder(emailSubject, '');

    const newSchedule = await Schedule.create({
      emailSubject,
      emailRecipient,
      emailSentAt,
      reminderText: reminder,
      scheduledAt,
      status: 'pending',
      delay,
    });

    res.status(201).json(newSchedule);
  } catch (err) {
    next(err);
  }
}

async function getSchedules(req, res, next) {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (search) {
      where.emailSubject = { [Op.iLike]: `%${search}%` };
    }

    const schedules = await Schedule.findAll({
      where,
      order: [['scheduledAt', 'ASC']],
    });

    res.json(schedules);
  } catch (err) {
    next(err);
  }
}

async function getSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (err) {
    next(err);
  }
}

async function updateSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const allowedFields = ['delay', 'scheduledAt', 'status', 'reminderText'];
    const { delay, scheduledAt, status, reminderText } = req.body;
    const updateData = {};

    if (delay !== undefined) {
      if (delay <= 0) {
        return res.status(400).json({ error: 'Delay must be positive' });
      }
      updateData.delay = delay;
    }
    if (scheduledAt !== undefined) {
      const date = new Date(scheduledAt);
      if (isNaN(date)) {
        return res.status(400).json({ error: 'Invalid scheduledAt date' });
      }
      updateData.scheduledAt = date;
    }
    if (status !== undefined) {
      const allowedStatuses = ['pending', 'completed', 'canceled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
        });
      }
      updateData.status = status;
    }
    if (reminderText !== undefined) {
      updateData.reminderText = reminderText;
    }

    await schedule.update(updateData);
    res.json(schedule);
  } catch (err) {
    next(err);
  }
}

async function deleteSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    await schedule.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};