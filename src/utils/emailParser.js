```javascript
/**
 * Parsing logic to extract email subject and body from incoming events.
 * The extension receives events from the background script that contain
 * the raw email data (subject, body, recipients, etc.).
 */

export const parseEmailEvent = (event) => {
  // Expecting an event shape similar to:
  // {
  //   type: 'email-sent',
  //   subject: 'Your subject here',
  //   body: '<p>Hello world</p><p>Some more text</p>',
  //   to: ['recipient@example.com'],
  //   cc: ['cc@example.com'],
  //   bcc: [],
  //   from: 'sender@example.com',
  //   timestamp: 1727345678901
  // }

  if (!event || typeof event !== 'object') {
    throw new Error('Invalid event object');
  }

  const { subject, body, timestamp } = event;

  if (typeof subject !== 'string' || typeof body !== 'string') {
    throw new Error('Event missing required string fields: subject or body');
  }

  // Basic validation of timestamp (optional)
  if (timestamp != null && isNaN(parseInt(timestamp, 10))) {
    throw new Error('Invalid timestamp in event');
  }

  return {
    subject: subject.trim(),
    body: body.trim(),
    sentAt: new Date(parseInt(timestamp, 10)),
  };
};
```