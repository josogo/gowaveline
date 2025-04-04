
# Backend Integration Guide for Merchant Statement Analysis

This document explains how to set up the backend services for the merchant statement analysis application.

## Backend Service Requirements

To fully implement the backend for processing merchant statements, you'll need:

1. A server to receive the uploaded files (Node.js with Express or Python with FastAPI)
2. Google Cloud Document AI API integration for parsing PDF documents
3. OpenAI API integration for analyzing text content

## Implementation Steps

### 1. Set up Google Cloud Document AI

1. Create a Google Cloud account and project
2. Enable the Document AI API in your project
3. Create a processor for parsing forms/invoices
4. Generate a service account key with Document AI permissions

### 2. Set up OpenAI API

1. Create an OpenAI account
2. Generate an API key
3. Select the appropriate model (GPT-4 recommended)

### 3. Server Implementation Example (Node.js with Express)

```javascript
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const { OpenAI } = require('openai');

// Configure environment variables
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const GOOGLE_LOCATION = process.env.GOOGLE_LOCATION || 'us';
const GOOGLE_PROCESSOR_ID = process.env.GOOGLE_PROCESSOR_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize clients
const documentAIClient = new DocumentProcessorServiceClient();
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Configure express and multer
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

async function processDocumentWithGoogleAI(fileBuffer, mimeType) {
  const name = `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/processors/${GOOGLE_PROCESSOR_ID}`;
  
  const request = {
    name,
    rawDocument: {
      content: fileBuffer.toString('base64'),
      mimeType: mimeType,
    },
  };
  
  const [result] = await documentAIClient.processDocument(request);
  return result.document;
}

async function analyzeWithOpenAI(extractedText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a financial analyst specialized in merchant processing statements."
      },
      {
        role: "user",
        content: `Extract and provide the following information from this merchant statement: 
        1. Effective rate (total fees divided by total volume)
        2. Monthly processing volume
        3. Chargeback ratio
        4. Pricing model (interchange-plus or tiered)
        5. List all fees (monthly fee, PCI fee, statement fee, batch fee, transaction fees, etc.)
        
        Format the response as a JSON object with these fields. Here's the statement:
        
        ${extractedText}`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  
  return JSON.parse(response.choices[0].message.content);
}

// API endpoint to process statements
app.post('/api/analyze-statement', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }
    
    // Process with Google Document AI
    const mimeType = req.file.mimetype;
    const document = await processDocumentWithGoogleAI(req.file.buffer, mimeType);
    
    // Extract text from document
    const extractedText = document.text;
    
    // Analyze text with OpenAI
    const analysis = await analyzeWithOpenAI(extractedText);
    
    res.status(200).send({
      success: true,
      ...analysis
    });
    
  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).send({ 
      error: 'Error processing document',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Deployment Options

1. **Google Cloud Run** - Serverless container platform
2. **Google App Engine** - Platform as a Service
3. **AWS Lambda with API Gateway** - Serverless function
4. **Heroku** - Platform as a Service

### 5. Environment Variables Required

- `GOOGLE_PROJECT_ID` - Your Google Cloud project ID
- `GOOGLE_LOCATION` - Location of your Document AI processor (e.g., 'us')
- `GOOGLE_PROCESSOR_ID` - ID of your Document AI processor
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to your service account JSON file
- `OPENAI_API_KEY` - Your OpenAI API key

## Integration with Frontend

Update the `src/services/statementService.ts` file with your actual API endpoint once the backend is deployed.
