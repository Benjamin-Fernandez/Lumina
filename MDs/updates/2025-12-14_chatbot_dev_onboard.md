# Lumina Third-Party Chatbot Developer Deployment Guide


**Date:** 13 December 2024
**Version:** 1.0


---


## Summary


This guide provides step-by-step instructions for third-party chatbot developers to deploy their chatbots to the Lumina platform. After following this guide, your chatbot will be available to students on the Lumina mobile app.


**What Lumina Provides:**
- A mobile app interface for students to interact with your chatbot
- User authentication and conversation management
- Request/response handling between students and your chatbot API


**What You Provide:**
- A REST API endpoint that accepts user queries and returns responses
- API authentication (if required)


---


## Prerequisites


Before deploying to Lumina, ensure you have:


1. **A deployed chatbot API** accessible via HTTPS
  - Must be publicly accessible (or accessible with an API key)
  - Must respond to POST requests
  - Must accept JSON or plain text request bodies


2. **An NTU email account** to access the Lumina Developer Portal


3. **Your chatbot's details:**
  - Server URL (e.g., `https://my-chatbot.azurewebsites.net`)
  - Endpoint path (e.g., `/api/chat` or `/query`)
  - Request body format (JSON or plain text)
  - The key name for the user query in your JSON body (e.g., `query`, `message`, `input`)
  - API key or Bearer token (if your endpoint requires authentication)


4. **A chatbot image** (recommended: square, at least 256x256 pixels)


---


## API Contract Requirements


Your chatbot API **must** follow this contract:


### Request Format


**For JSON (application/json):**
```http
POST /your-endpoint HTTP/1.1
Content-Type: application/json


{
 "query": "user's message here"
}
```
- The key name (e.g., `query`) is configurable during deployment
- Lumina sends exactly one key with the user's message as a string value


**For Plain Text (text/plain):**
```http
POST /your-endpoint HTTP/1.1
Content-Type: text/plain


user's message here
```


### Response Format


Your API should return a response that Lumina can display to the user:


**JSON Response (Recommended):**
```json
{
 "response": "Your chatbot's response here"
}
```


**Plain Text Response:**
```
Your chatbot's response here
```


### Authentication Headers (If Configured)


If you configure API Key authentication:
```http
X-API-Key: your-api-key
```


If you configure Bearer Token authentication:
```http
Authorization: Bearer your-token
```


---


## Step-by-Step Deployment Process


### Step 1: Access the Developer Portal


1. Navigate to the Lumina Web Portal: `https://lumina-web-fe.azurewebsites.net`
2. Sign in with your NTU email via Microsoft SSO
3. Click on **"Create Plugin"** from the dashboard


### Step 2: Read the Instructions


1. Read through the deployment guide displayed on screen
2. Acknowledge by checking the "I have read and acknowledged the guide" checkbox
3. Click **"Next"**


### Step 3: Enter Plugin Details


Fill in the following information about your chatbot:


| Field | Description | Example |
|-------|-------------|---------|
| **Name** | A catchy, descriptive name for your chatbot. Include course code if applicable | "CS2103T Helper Bot" |
| **Category** | Select: Modules, Career, School, or General | "Modules" |
| **Description** | What your chatbot does and why students should use it | "Get instant help with..." |
| **Image** | Upload a square image (PNG/JPG, max 1MB) | chatbot-icon.png |


Click **"Next"** when complete.


### Step 4: Configure Plugin Endpoint


This is the critical step where you tell Lumina how to call your chatbot:


| Field | Description | Example |
|-------|-------------|---------|
| **Server URL** | Base URL where your API is hosted | `https://my-bot.azurewebsites.net` |
| **Path** | The endpoint path Lumina will call | `/api/chat` |
| **Request Format** | `application/json` or `text/plain` | `application/json` |
| **Request Body Content Type** | For JSON: `object` or `string` | `object` |
| **Request Body Query Key** | The JSON key for the user's message | `query` |
| **Authentication Type** | None, API Key, or Bearer Token | `API Key` |
| **API Key / Bearer Token** | Your secret key (if auth is required) | `sk-abc123...` |


#### Authentication Options Explained:


- **None**: Use if your API is publicly accessible without authentication
- **API Key**: Your key will be sent in the `X-API-Key` header
- **Bearer Token**: Your token will be sent as `Authorization: Bearer <token>`


Click **"Next"** when complete.




## What Happens After Submission


1. **Database Storage**: Your plugin is saved to the Lumina web database
2. **Automatic Sync**: An Azure Timer Function runs every minute to sync new/updated plugins to the mobile database
3. **Mobile Availability**: Within 1-2 minutes, students can find your chatbot in the Lumina mobile app store
4. **Activation Status**: Plugins are activated by default; you can deactivate them later from the developer portal


---


## Editing Your Plugin


After deployment, you can edit your plugin:


1. Go to the Developer Portal dashboard
2. Click on your plugin
3. Click **"Edit"**
4. Modify any field (including endpoint configuration and authentication)
5. Click **"Save"**


Changes sync to the mobile app within 1-2 minutes.


---


## Troubleshooting Common Issues


### "Error: Operation not found for path"
- **Cause**: The path you specified doesn't match your API
- **Fix**: Verify the Path field matches your actual API endpoint (include leading `/`)


### "Error: No schema found for requestBody"
- **Cause**: Request format mismatch
- **Fix**: Ensure your API accepts the content type you specified


### "Error: requestBodySchema.properties is undefined"
- **Cause**: JSON schema issue
- **Fix**: Ensure Request Body Content Type is set to `object` for JSON requests


### "Network Error" or timeout
- **Cause**: Your API is unreachable
- **Fix**:
 - Verify your Server URL is correct and uses HTTPS
 - Ensure your API is running and accessible from the internet
 - Check CORS is enabled (if applicable)


### "401 Unauthorized" or "403 Forbidden"
- **Cause**: Authentication failed
- **Fix**:
 - Verify your API Key or Bearer Token is correct
 - Ensure you selected the correct Authentication Type
 - Check your API expects the key in the header we send (`X-API-Key` or `Authorization: Bearer`)


### Plugin not appearing on mobile app
- **Cause**: Sync hasn't completed yet
- **Fix**: Wait 1-2 minutes for the sync function to run


---


## Technical Reference


### Generated OpenAPI Schema


Lumina automatically generates an OpenAPI 3.0.0 schema from your inputs:


```yaml
openapi: 3.0.0
info:
 title: YourPluginNameAPI
 version: 1.0.0
servers:
 - url: https://your-server.com
paths:
 /your-path:
   post:
     operationId: getResponse
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             properties:
               query:
                 type: string
     responses:
       '200':
         content:
           application/json:
             schema:
               type: string
```


### Data Flow Architecture


```
┌─────────────────┐     POST /plugin     ┌─────────────────┐
│  Developer      │ ─────────────────────▶│  Web Backend    │
│  Portal (Web)   │                       │  (Express.js)   │
└─────────────────┘                       └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │  Web Database   │
                                         │  (plugins)      │
                                         └────────┬────────┘
                                                  │
                                   Azure Timer (every 60s)
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │  Mobile DB      │
                                         │  (chatbots)     │
                                         └────────┬────────┘
                                                  │
                                                  ▼
┌─────────────────┐    GET chatbots     ┌─────────────────┐
│  Student        │ ◀────────────────────│  Mobile Backend │
│  Mobile App     │                      │  (Express.js)   │
└────────┬────────┘                      └────────┬────────┘
        │                                        │
        │  POST /custom (message, schema, auth)  │
        └────────────────────────────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Your Chatbot   │
                 │  API            │
                 └─────────────────┘
```


---


## Support


For issues or questions:
- Check this documentation first
- Contact the Lumina development team via your NTU channels


---


## Version History


| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-13 | Initial documentation with auth support |





