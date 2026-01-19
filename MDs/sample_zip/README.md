# Lumina Chatbot Deployment Package


This folder contains a **template Azure Function** that you can customize and deploy to Lumina as a managed chatbot plugin.


## Quick Start


1. **Customize the code** - Edit `function_app.py` to implement your chatbot logic
2. **Add dependencies** - Add any Python packages to `requirements.txt`
3. **Create zip file** - Zip all files (not the folder itself)
4. **Upload to Lumina** - Use the Lumina web portal to create a plugin with "Managed Deployment"


---


## Required Files


Your zip file **must** contain these files at the root level:


| File | Purpose | Required |
|------|---------|----------|
| `function_app.py` | Your chatbot logic (Azure Functions v2 programming model) | ✅ YES |
| `requirements.txt` | Python package dependencies | ✅ YES |
| `host.json` | Azure Functions host configuration | ✅ YES |


### Optional Files


| File | Purpose | Notes |
|------|---------|-------|
| `local.settings.json` | Local development settings | ⚠️ Will be ignored in deployment |
| `__pycache__/` | Python bytecode cache | ⚠️ Exclude from zip |


---


## File Structure


```
your-chatbot.zip
├── function_app.py      ← Your main code (REQUIRED)
├── requirements.txt     ← Dependencies (REQUIRED)
├── host.json            ← Host config (REQUIRED)
└── (other .py files)    ← Optional helper modules
```


**Important:** Files must be at the ROOT of the zip, not inside a subfolder.


✅ Correct: `zip -r chatbot.zip function_app.py requirements.txt host.json`
❌ Wrong: `zip -r chatbot.zip my-folder/` (creates nested structure)


---


## How to Create the Zip File


### On macOS/Linux:
```bash
cd /path/to/your/function
zip -r ../my-chatbot.zip function_app.py requirements.txt host.json
```


### On Windows (PowerShell):
```powershell
Compress-Archive -Path function_app.py,requirements.txt,host.json -DestinationPath my-chatbot.zip
```


### On Windows (File Explorer):
1. Select all required files (Ctrl+click each)
2. Right-click → "Send to" → "Compressed (zipped) folder"


---


## Customizing Your Chatbot


### Step 1: Edit `function_app.py`


The template provides a basic echo chatbot. Replace the logic in the `chat()` function:


```python
@app.route(route="chat", methods=["POST"])
def chat(req: func.HttpRequest) -> func.HttpResponse:
   """
   Your chatbot endpoint.
  
   Request body (JSON):
   {
       "query": "User's message here"
   }
  
   Response (JSON):
   {
       "response": "Your chatbot's reply"
   }
   """
   req_body = req.get_json()
   user_message = req_body.get("query", "")
  
   # ========================================
   # YOUR CHATBOT LOGIC HERE
   # ========================================
   # Examples:
   # - Call OpenAI API
   # - Query a database
   # - Process with a local ML model
   # - Call external APIs
  
   response_text = f"You said: {user_message}"  # Replace this!
  
   return func.HttpResponse(
       json.dumps({"response": response_text}),
       mimetype="application/json"
   )
```


### Step 2: Add Dependencies to `requirements.txt`


If your chatbot uses external libraries, add them:


```
azure-functions
openai>=1.0.0
requests>=2.28.0
langchain>=0.1.0
```


### Step 3: Test Locally (Optional but Recommended)


```bash
# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4


# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows


# Install dependencies
pip install -r requirements.txt


# Run locally
func start
```


Test with curl:
```bash
curl -X POST http://localhost:7071/api/chat \
 -H "Content-Type: application/json" \
 -d '{"query": "Hello!"}'
```


---


## Deployment


1. Go to the Lumina Developer Portal
2. Click "Create New Plugin"
3. Fill in plugin details (name, description, category)
4. Select **"Managed Deployment"** mode
5. Upload your `.zip` file
6. Wait for validation (green checkmark = ready)
7. Complete the wizard
8. Your chatbot is live!


---


## Endpoint URL


After deployment, your endpoint will be:
```
https://lumina-XXXXXXXX-XXXXXXXX.azurewebsites.net/api/chat
```


Lumina automatically configures this URL in your plugin settings.


---


## Troubleshooting


| Issue | Solution |
|-------|----------|
| "Missing required file" | Ensure files are at zip root, not in subfolder |
| "Invalid zip file" | Re-create zip; ensure it's a valid ZIP format |
| Deployment timeout | Check requirements.txt for compatible versions |
| Function not responding | Test locally first with `func start` |


---


## Support


- Documentation: [Lumina Developer Docs](#)
- Issues: Contact Lumina support
- Azure Functions: [Microsoft Docs](https://learn.microsoft.com/azure/azure-functions/)







