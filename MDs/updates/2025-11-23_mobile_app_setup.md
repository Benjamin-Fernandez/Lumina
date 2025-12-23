# Mobile App Backend Connection Guide


## 🎯 Quick Answer


### Question 1: How to connect mobile app to backend when running locally?


**Current Status**: Your mobile app is configured to connect to the **production backend** on Azure:
```
https://lumina-mobile-be-cahcaybjbbhxdzf4.southeastasia-01.azurewebsites.net
```


**To connect to local backend**: You need to update the configuration file.


### Question 2: Should you have access to GPT-4o endpoint?


**YES**, but only if:
1. ✅ The backend has valid Azure OpenAI credentials configured
2. ✅ You have an active Azure OpenAI deployment
3. ✅ The environment variables are set correctly on the backend


---


## 📱 How Mobile App Connects to Backend


### Current Configuration


The mobile app uses a centralized configuration file:


**File**: `Lumina-Mobile-FE/config/authConfig.js`


````javascript
// Backend API Configuration
export const apiConfig = {
baseURL: "https://lumina-mobile-be-cahcaybjbbhxdzf4.southeastasia-01.azurewebsites.net",
};
````


This configuration is imported by axios:


````javascript
import axios from "axios";
import { apiConfig } from "./authConfig";


axios.defaults.baseURL = apiConfig.baseURL;
````


---


## 🔧 How to Connect to Local Backend


### Step 1: Find Your Computer's Local IP Address


**On macOS/Linux**:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```


**On Windows**:
```bash
ipconfig
```


Look for your **local network IP** (usually starts with `192.168.x.x` or `10.x.x.x`)


**Example**: `192.168.1.100`


### Step 2: Start Your Local Backend


```bash
cd Lumina-Mobile-BE
npm install
npm run dev
```


The backend should start on port **3002**.


### Step 3: Update Mobile App Configuration


**Option A: Temporary Change (Recommended for Testing)**


Edit `Lumina-Mobile-FE/config/axiosConfig.js`:


```javascript
import axios from "axios";
import { apiConfig } from "./authConfig";


// COMMENT OUT production URL
// axios.defaults.baseURL = apiConfig.baseURL;


// USE YOUR LOCAL IP (replace with your actual IP)
axios.defaults.baseURL = "http://192.168.1.100:3002";


export default axios;
```


**Option B: Update Central Config**


Edit `Lumina-Mobile-FE/config/authConfig.js`:


```javascript
export const apiConfig = {
// Production (comment out)
// baseURL: "https://lumina-mobile-be-cahcaybjbbhxdzf4.southeastasia-01.azurewebsites.net",
// Local development (replace with your IP)
baseURL: "http://192.168.1.100:3002",
};
```


### Step 4: Restart Expo


```bash
cd Lumina-Mobile-FE
npx expo start --clear
```


### Step 5: Scan QR Code with Phone


**IMPORTANT**: Your phone and laptop must be on the **same WiFi network**!


1. Open Expo Go app on your phone
2. Scan the QR code from terminal
3. App should load and connect to your local backend


---


## 🧪 How to Test Connection


### Test 1: Check Backend is Running


Open browser and visit:
```
http://192.168.1.100:3002
```


You should see: **"WELCOME TO LUMINA!"**


### Test 2: Check from Phone


Once the app loads on your phone:
1. Try to sign in with Azure AD
2. After login, check if chatbots load on home screen
3. Try sending a message to GPT-4o


### Test 3: Check Backend Logs


In your backend terminal, you should see:
```
Connected to database
Server running on port 3002
```


When you use the app, you'll see API requests logged.


---


## 🤖 GPT-4o Endpoint Access


### How It Works


When you chat with "Lumina GPT-4o" (chatbotId = "0"), the app:


1. **Mobile App** sends message to backend:
  ```
  POST /openai
  Body: { messages: [...] }
  ```


2. **Backend** forwards to Azure OpenAI:
  ```javascript
  const API = `${process.env.AZURE_OPENAI_API_BASE}?api-version=${process.env.AZURE_OPENAI_APIVERSION}&api-key=${process.env.AZURE_OPENAI_APIKEY}`;
  ```


3. **Azure OpenAI** returns GPT-4o-mini response


4. **Backend** sends response back to mobile app


### Required Environment Variables


The backend needs these environment variables in `.env` file:


```env
PORT=3002
MONGODB_URI=<your-mongodb-connection-string>
AZURE_OPENAI_API_BASE=<your-azure-openai-endpoint>
AZURE_OPENAI_APIVERSION=<api-version>
AZURE_OPENAI_APIKEY=<your-api-key>
```


### Do You Have Access?


**Check 1: Production Backend**


The production backend at `https://lumina-mobile-be-cahcaybjbbhxdzf4.southeastasia-01.azurewebsites.net` should have these configured in Azure App Service.


**To verify**:
1. Go to Azure Portal
2. Navigate to App Service: `lumina-mobile-be`
3. Go to **Configuration** → **Application settings**
4. Check if these variables exist:
  - `AZURE_OPENAI_API_BASE`
  - `AZURE_OPENAI_APIVERSION`
  - `AZURE_OPENAI_APIKEY`


**Check 2: Local Backend**


If running locally, you need to create `.env` file in `Lumina-Mobile-BE/`:


```bash
cd Lumina-Mobile-BE
touch .env
```


Then add the Azure OpenAI credentials (get from Azure Portal or previous developer).


---


## 🚨 Common Issues & Solutions


### Issue 1: "Network request failed"


**Cause**: Phone can't reach backend


**Solutions**:
- ✅ Ensure phone and laptop on same WiFi
- ✅ Check firewall isn't blocking port 3002
- ✅ Verify IP address is correct
- ✅ Try `http://` not `https://` for local


### Issue 2: "Cannot connect to backend"


**Cause**: Backend not running or wrong URL


**Solutions**:
- ✅ Check backend is running: `npm run dev`
- ✅ Test in browser: `http://YOUR_IP:3002`
- ✅ Check port 3002 is not in use


### Issue 3: GPT-4o returns error


**Cause**: Missing or invalid Azure OpenAI credentials


**Solutions**:
- ✅ Check `.env` file exists and has correct values
- ✅ Verify Azure OpenAI deployment is active
- ✅ Check API key is valid
- ✅ Check backend logs for error details


### Issue 4: "CORS error"


**Cause**: Backend doesn't allow requests from Expo


**Solution**: This shouldn't happen with Expo, but if it does, the backend needs CORS middleware (currently not configured).


---


## 📋 Step-by-Step Checklist


### For Production Backend (Current Setup)


- [ ] Mobile app is configured to use production URL
- [ ] Azure backend is running (check URL in browser)
- [ ] Azure OpenAI credentials are configured in App Service
- [ ] Phone has internet connection
- [ ] Can sign in with Azure AD
- [ ] Can see chatbots on home screen
- [ ] Can send messages to GPT-4o


### For Local Development


- [ ] Found local IP address (e.g., `192.168.1.100`)
- [ ] Backend is running locally (`npm run dev`)
- [ ] Can access `http://YOUR_IP:3002` in browser
- [ ] Updated `axiosConfig.js` with local IP
- [ ] Phone and laptop on same WiFi network
- [ ] Restarted Expo with `--clear` flag
- [ ] Scanned QR code with phone
- [ ] App loads successfully
- [ ] Can make API calls to local backend


---


## 🔍 Debugging Tips


### Enable Detailed Logging


**In Mobile App** (`Lumina-Mobile-FE/config/axiosConfig.js`):


```javascript
import axios from "axios";
import { apiConfig } from "./authConfig";


axios.defaults.baseURL = "http://192.168.1.100:3002";


// Add request interceptor for debugging
axios.interceptors.request.use(request => {
 console.log('Starting Request:', request.url);
 console.log('Full URL:', request.baseURL + request.url);
 return request;
});


// Add response interceptor for debugging
axios.interceptors.response.use(
 response => {
   console.log('Response:', response.status);
   return response;
 },
 error => {
   console.log('Error:', error.message);
   if (error.response) {
     console.log('Error Response:', error.response.data);
   }
   return Promise.reject(error);
 }
);


export default axios;
```


**In Backend** (`Lumina-Mobile-BE/index.js`):


Add logging middleware:


```javascript
// Add this BEFORE your routes
app.use((req, res, next) => {
 console.log(`${req.method} ${req.path}`);
 console.log('Body:', req.body);
 next();
});
```


### Check Network in Expo


When running `npx expo start`, you'll see:


```
Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)


› Using Expo Go
› Press s │ switch to development build
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web


› Press r │ reload app
› Press m │ toggle menu
```


The IP address shown here (`192.168.1.100`) is what you should use in your backend URL.


---


## 🎓 Understanding the Architecture


### Production Flow


```
┌─────────────────┐
│  Mobile App     │
│  (Your Phone)   │
└────────┬────────┘
        │ HTTPS
        ▼
┌─────────────────────────────────────────────────┐
│  Azure App Service (Production Backend)         │
│  lumina-mobile-be-cahcaybjbbhxdzf4...           │
└────────┬────────────────────────┬────────────────┘
        │                        │
        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  Azure Cosmos   │      │  Azure OpenAI   │
│  DB (MongoDB)   │      │  (GPT-4o-mini)  │
└─────────────────┘      └─────────────────┘
```


### Local Development Flow


```
┌─────────────────┐
│  Mobile App     │
│  (Your Phone)   │
└────────┬────────┘
        │ HTTP (Same WiFi)
        ▼
┌─────────────────────────────────────────────────┐
│  Local Backend (Your Laptop)                    │
│  http://192.168.1.100:3002                      │
└────────┬────────────────────────┬────────────────┘
        │                        │
        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  Azure Cosmos   │      │  Azure OpenAI   │
│  DB (MongoDB)   │      │  (GPT-4o-mini)  │
│  (Still Cloud)  │      │  (Still Cloud)  │
└─────────────────┘      └─────────────────┘
```


**Note**: Even when running backend locally, you still connect to:
- Azure Cosmos DB (cloud database)
- Azure OpenAI (cloud AI service)


Only the Express.js server runs locally.


---


## 🔐 Azure OpenAI Access - Detailed Check


### Where to Find Your Azure OpenAI Credentials


1. **Azure Portal** → Search "Azure OpenAI"
2. Click your OpenAI resource
3. Go to **Keys and Endpoint**
4. You'll see:
  - **Endpoint**: `https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT/chat/completions`
  - **Key 1**: `abc123...` (your API key)
  - **API Version**: Usually `2024-02-15-preview` or similar


### Environment Variable Format


```env
AZURE_OPENAI_API_BASE=https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT/chat/completions
AZURE_OPENAI_APIVERSION=2024-02-15-preview
AZURE_OPENAI_APIKEY=abc123yourapikey456
```


### How to Check if You Have Access


**Method 1: Check Azure Portal**
1. Go to Azure Portal
2. Search for "Azure OpenAI"
3. If you see a resource, you have access
4. Check if deployment exists (e.g., `gpt-4o-mini`)


**Method 2: Check Production Backend**
1. Go to Azure Portal
2. Navigate to App Service: `lumina-mobile-be`
3. **Configuration** → **Application settings**
4. Look for `AZURE_OPENAI_*` variables


**Method 3: Test the Endpoint**


Try chatting with GPT-4o in the mobile app:
- If it works → You have access ✅
- If it returns error → Check backend logs for details


### What if You Don't Have Access?


**Option 1: Get credentials from previous developer**


**Option 2: Create new Azure OpenAI resource**
1. Azure Portal → Create Resource
2. Search "Azure OpenAI"
3. Create new resource
4. Deploy `gpt-4o-mini` model
5. Get credentials and update backend


**Option 3: Use different AI service**


You could modify the backend to use:
- OpenAI API (non-Azure)
- Anthropic Claude
- Other LLM providers


---


## 📞 Quick Reference


### Current Configuration


| Component | Value |
|-----------|-------|
| **Production Backend** | `https://lumina-mobile-be-cahcaybjbbhxdzf4.southeastasia-01.azurewebsites.net` |
| **Backend Port** | `3002` |
| **Config File** | `Lumina-Mobile-FE/config/authConfig.js` |
| **Axios Config** | `Lumina-Mobile-FE/config/axiosConfig.js` |
| **GPT Endpoint** | `/openai` (POST) |
| **Chatbot ID for GPT** | `"0"` |


### Local Development URLs


Replace `192.168.1.100` with your actual IP:


| Service | URL |
|---------|-----|
| **Backend API** | `http://192.168.1.100:3002` |
| **Test Endpoint** | `http://192.168.1.100:3002/` |
| **Expo Metro** | `exp://192.168.1.100:8081` |


### Important Files


```
Lumina-Mobile-FE/
├── config/
│   ├── authConfig.js      ← Backend URL configured here
│   └── axiosConfig.js     ← Axios uses this config
└── app/
   └── conversation/[id].jsx  ← GPT-4o chat logic


Lumina-Mobile-BE/
├── .env                   ← Azure OpenAI credentials (local)
├── index.js              ← Server entry point
└── controllers/
   └── openai.controller.js  ← GPT-4o endpoint handler
```


---


## ✅ Final Answer to Your Questions


### Question 1: How to ensure mobile app connects to backend?


**Current Setup (Production)**:
- ✅ Already configured to connect to Azure backend
- ✅ Should work out of the box when you scan QR code
- ✅ Phone needs internet connection


**Local Development**:
1. Find your laptop's IP address
2. Update `Lumina-Mobile-FE/config/axiosConfig.js` with your IP
3. Start backend: `cd Lumina-Mobile-BE && npm run dev`
4. Start Expo: `cd Lumina-Mobile-FE && npx expo start --clear`
5. Ensure phone and laptop on same WiFi
6. Scan QR code with phone


### Question 2: Should you have access to GPT-4o endpoint?


**YES**, you should have access if:


1. ✅ **Azure OpenAI is configured** in the backend (check Azure Portal)
2. ✅ **Environment variables are set** (production: Azure App Service settings, local: `.env` file)
3. ✅ **You have valid credentials** (API key, endpoint, deployment name)


**To verify**:
- Try chatting with "Lumina GPT-4o" in the app
- If it works → You have access ✅
- If it fails → Check backend logs and Azure OpenAI configuration


**If you don't have access**:
- Get credentials from previous developer, OR
- Create new Azure OpenAI resource in Azure Portal


---


