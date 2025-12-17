# Email Setup Instructions

The contact form is configured to send emails to **Yosef.Luleseged@addispcb.com** using EmailJS.

## Setup Steps:

### 1. Create an EmailJS Account
- Go to https://www.emailjs.com/
- Sign up for a free account (200 emails/month free)

### 2. Add Email Service
- Go to https://dashboard.emailjs.com/admin/integration
- Click "Add New Service"
- Select your email provider (Gmail, Outlook, etc.)
- Follow the setup instructions
- **Note your Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
- Go to https://dashboard.emailjs.com/admin/template
- Click "Create New Template"
- Use this template structure:

**Template Name:** Contact Form

**To Email:** Yosef.Luleseged@addispcb.com

**Subject:** New Contact Form Submission from {{from_name}}

**Content:**
```
From: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Service Interest: {{service_interest}}

Message:
{{message}}

---
Reply to: {{reply_to}}
```

- **Note your Template ID** (e.g., `template_xyz789`)

### 4. Get Your Public Key
- Go to https://dashboard.emailjs.com/admin/integration
- Copy your **Public Key** (e.g., `abcdefghijklmnop`)

### 5. Update script.js
Open `script.js` and replace these placeholders:

1. Replace `YOUR_PUBLIC_KEY` with your EmailJS Public Key (line ~108)
2. Replace `YOUR_SERVICE_ID` with your Service ID (line ~137)
3. Replace `YOUR_TEMPLATE_ID` with your Template ID (line ~137)

Example:
```javascript
emailjs.init("abc123def456"); // Your Public Key

emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

### 6. Test the Form
- Open contact.html in your browser
- Fill out and submit the form
- Check the email inbox for Yosef.Luleseged@addispcb.com

## Alternative: Quick Setup without EmailJS

If you prefer not to use EmailJS, you can also:
1. Use a backend service (PHP, Node.js, etc.)
2. Use Formspree (similar to EmailJS, simpler setup)
3. Use a static form handler service

Let me know if you need help with any of these alternatives!

