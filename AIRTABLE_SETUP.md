# Airtable Integration Setup

This application includes a complete Airtable integration for collecting contact information from the AI chatbot.

## Environment Variables Required

Add these environment variables to your deployment or `.env` file:

```env
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_TABLE_NAME=Contacts
```

## Airtable Base Setup

### 1. Create a new Airtable Base

- Go to [Airtable.com](https://airtable.com) and create a new base
- Name it something like "Figures Solutions - Contacts"

### 2. Create the Contacts Table

Create a table called "Contacts" with these fields:

| Field Name | Field Type       | Description                                        |
| ---------- | ---------------- | -------------------------------------------------- |
| Name       | Single line text | Contact's full name                                |
| Email      | Email            | Contact's email address                            |
| Phone      | Phone number     | Contact's phone number                             |
| Source     | Single select    | How they found us (AI Chatbot, Website, etc.)      |
| Created    | Date and time    | When the record was created                        |
| Status     | Single select    | Lead status (New Lead, Contacted, Qualified, etc.) |

### 3. Get Your API Credentials

#### Base ID:

1. Go to your Airtable base
2. Click "Help" → "API documentation"
3. The Base ID will be shown at the top (starts with "app...")

#### API Key:

1. Go to [Airtable Account](https://airtable.com/account)
2. Go to "Developer hub" → "Personal access tokens"
3. Create a new token with these scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
4. Add your base to the token permissions

## How It Works

1. **Contact Collection**: The AI chatbot collects name, email, and phone number
2. **Validation**: Client-side and server-side validation ensures data quality
3. **API Submission**: Data is sent to `/api/airtable/contact` endpoint
4. **Airtable Storage**: Contact is automatically saved to your Airtable base
5. **Follow-up**: You can manually send surveys or automation from Airtable

## Survey Follow-up Process

After contacts are saved to Airtable, you can:

1. **Manual Survey Sending**:

   - Use Airtable's built-in email features
   - Send personalized survey links
   - Track response status

2. **Automated Follow-up**:

   - Set up Airtable automations
   - Trigger emails when new contacts are added
   - Integration with tools like Zapier, Make.com

3. **Survey Tools**:
   - Typeform
   - Google Forms
   - Airtable Forms
   - Custom surveys

## Error Handling

The integration includes comprehensive error handling:

- Field validation (email format, phone format)
- API error responses
- Graceful fallbacks if Airtable is unavailable
- Development vs production error messages

## Testing

To test the integration:

1. Set up your Airtable base as described above
2. Add the environment variables
3. Open the website and use the chatbot
4. Check your Airtable base for the new contact record

## Security Notes

- API keys are server-side only (not exposed to browser)
- Input validation prevents malicious data
- Rate limiting recommended for production use
- Consider adding CAPTCHA for production deployment
