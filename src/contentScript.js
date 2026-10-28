// contentScript.js - Content script injected into email composition pages

// Detect clicks on the Send button in Gmail and Outlook web interfaces
document.addEventListener('click', (event) => {
  const gmailSendButton = document.querySelector('button[aria-label="Send email"]');
  const outlookSendButton = document.querySelector('button#send');

  if (gmailSendButton || outlookSendButton) {
    // Extract email metadata
    const subjectEl = document.querySelector('input[name="subject"], input#subject');
    const toEl = document.querySelector('input[name="to"], input#to');

    const emailSubject = subjectEl ? subjectEl.value.trim() : '';
    const emailTo = toEl ? toEl.value.trim() : '';

    // Notify background script of the send event
    chrome.runtime.sendMessage({
      type: 'emailSend',
      subject: emailSubject,
      to: emailTo,
    });
  }
});