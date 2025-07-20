/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Airtable contact submission data
 */
export interface AirtableContactData {
  name: string;
  email: string;
  phone: string;
  timestamp?: string;
}

/**
 * Airtable API response with Tally form link
 */
export interface AirtableResponse {
  success: boolean;
  message: string;
  recordId?: string;
  clientName?: string;
  tallyFormLink?: string;
  timestamp: string;
  error?: string;
}
