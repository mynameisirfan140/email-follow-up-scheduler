```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateScheduleBody(body) {
  const {
    emailSubject,
    emailRecipient,
    emailSentAt,
    delay,
    scheduledAt,
    reminderText,
  } = body;

  if (!emailSubject || typeof emailSubject !== 'string' || emailSubject.trim() === '') {
    throw new Error('emailSubject is required');
  }

  if (!emailRecipient || typeof emailRecipient !== 'string' || !emailRegex.test(emailRecipient.trim())) {
    throw new Error('emailRecipient must be a valid email address');
  }

  if (!emailSentAt || typeof emailSentAt !== 'string') {
    throw new Error('emailSentAt is required');
  }
  const sentDate = new Date(emailSentAt);
  if (isNaN(sentDate.getTime())) {
    throw new Error('emailSentAt must be a valid ISO date string');
  }

  if (delay == null || typeof delay !== 'number' || delay <= 0) {
    throw new Error('delay must be a positive number');
  }

  if (!scheduledAt || typeof scheduledAt !== 'string') {
    throw new Error('scheduledAt is required');
  }
  const scheduledDate = new Date(scheduledAt);
  if (isNaN(scheduledDate.getTime())) {
    throw new Error('scheduledAt must be a valid ISO date string');
  }

  if (reminderText !== undefined && typeof reminderText !== 'string') {
    throw new Error('reminderText must be a string');
  }

  // Business rule: scheduled time must be after the email was sent
  if (scheduledDate <= sentDate) {
    throw new Error('scheduledAt must be after emailSentAt');
  }

  return {
    emailSubject: emailSubject.trim(),
    emailRecipient: emailRecipient.trim(),
    emailSentAt: sentDate,
    delay: Math.floor(delay),
    scheduledAt: scheduledDate,
    reminderText: reminderText ? reminderText.trim() : null,
  };
}

function validateId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid schedule ID');
  }
  return Number(id);
}

module.exports = {
  validateScheduleBody,
  validateId,
};