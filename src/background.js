// background.js - Chrome extension background service worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('Email Follow-up Scheduler installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'schedule') {
    const { emailSubject, emailTo, scheduledDelayMinutes, reminderText } = request;

    // Validate required fields
    if (!emailSubject || !emailTo || !scheduledDelayMinutes) {
      console.warn('Missing required schedule data', request);
      return;
    }

    // Calculate when the reminder should fire
    const scheduledAt = new Date();
    scheduledAt.setMinutes(scheduledAt.getMinutes() + parseInt(scheduledDelayMinutes, 10));

    // Create a unique alarm identifier
    const alarmName = `followup-${Date.now()}`;

    // Schedule the alarm
    chrome.alarms.create(alarmName, { when: scheduledAt.getTime() });

    // Store schedule metadata for later use (e.g., notification content)
    await chrome.storage.local.set({ [alarmName]: { emailSubject, emailTo, reminderText } });

    sendResponse({ status: 'scheduled', alarmName });
  }
});

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('followup-')) {
    const schedule = await chrome.storage.local.get([alarm.name]);
    const data = schedule[alarm.name];
    if (!data) {
      console.warn('No schedule data found for alarm', alarm.name);
      return;
    }

    // Show a desktop notification
    const options = {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Follow‑up Reminder',
      message: data.reminderText,
    };
    chrome.notifications.create(`followup-${alarm.name}`, options);
  }
});