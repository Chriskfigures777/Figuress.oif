// Vercel serverless function for Airtable contact integration

export default async function handler(req, res) {
  // Enable CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "email", "phone"],
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        error: "Invalid phone format",
      });
    }

    // Airtable configuration
    const AIRTABLE_BASE_ID = "appOelFfmuyigfrUd";
    const AIRTABLE_API_KEY =
      "patmq3ByHdnNpok1C.feb4a07346609a18e16be5567882bf257f2f8376746a05295ced1aea0c138b89";
    const AIRTABLE_TABLE_NAME = "Clients";

    // Prepare Airtable record
    const record = {
      fields: {
        "Client Name": name,
        Email: email,
        Phone: phone,
      },
    };

    console.log("Creating Airtable record:", record);

    // Step 1: Create the record in Airtable
    const createResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: [record] }),
      },
    );

    if (!createResponse.ok) {
      const errorData = await createResponse.text();
      console.error("Airtable Create Error:", errorData);
      return res.status(500).json({
        error: "Failed to create contact record",
        details: process.env.NODE_ENV === "development" ? errorData : undefined,
      });
    }

    const createData = await createResponse.json();
    const recordId = createData.records[0].id;

    console.log("Created record with ID:", recordId);

    // Step 2: Search for the record using email to get the Tally form link
    const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula=({Email}='${email}')`;

    console.log("Searching for record with URL:", searchUrl);

    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.text();
      console.error("Airtable Search Error:", errorData);
      return res.status(500).json({
        error: "Failed to retrieve record details",
        details: process.env.NODE_ENV === "development" ? errorData : undefined,
      });
    }

    const searchData = await searchResponse.json();

    console.log("Search results:", searchData);

    if (!searchData.records || searchData.records.length === 0) {
      return res.status(404).json({
        error: "Record not found after creation",
      });
    }

    const foundRecord = searchData.records[0];
    const tallyFormLink = foundRecord.fields["Unique Tally Form Link"];

    console.log("Found Tally form link:", tallyFormLink);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Contact created and Tally form retrieved successfully",
      recordId: recordId,
      clientName: name,
      tallyFormLink: tallyFormLink || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Airtable submission error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to process contact submission",
    });
  }
}
