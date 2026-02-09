"""
Lumina Chatbot Plugin - Azure Function Template


This is a template for creating a chatbot plugin that can be deployed
to Lumina's managed hosting platform.


Customize the chat() function to implement your chatbot logic.
"""


import azure.functions as func
import json
import logging


# Initialize the Azure Functions app
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)




@app.route(route="http_trigger", methods=["POST"])
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
   """
   Main chatbot endpoint.
  
   This function receives user messages and returns chatbot responses.
   Lumina will call this endpoint when users interact with your plugin.
  
   Request Format (JSON):
   {
       "query": "User's message or question"
   }
  
   Response Format (JSON):
   {
       "response": "Your chatbot's reply"
   }
  
   Args:
       req: Azure Functions HTTP request object
      
   Returns:
       HTTP response with JSON body containing the chatbot's response
   """
   logging.info("Received chat request")
  
   try:
       # Parse the incoming JSON request
       req_body = req.get_json()
       user_query = req_body.get("query", "")
      
       if not user_query:
           return func.HttpResponse(
               json.dumps({"error": "No query provided"}),
               status_code=400,
               mimetype="application/json"
           )
      
       # ============================================================
       # YOUR CHATBOT LOGIC HERE
       # ============================================================
       #
       # Replace the code below with your own implementation.
       #
       # Examples of what you could do:
       #
       # 1. Call OpenAI API:
       #    from openai import OpenAI
       #    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
       #    completion = client.chat.completions.create(
       #        model="gpt-4",
       #        messages=[{"role": "user", "content": user_query}]
       #    )
       #    response_text = completion.choices[0].message.content
       #
       # 2. Query a database:
       #    import pymongo
       #    client = pymongo.MongoClient(os.environ.get("MONGO_URI"))
       #    result = client.db.collection.find_one({"query": user_query})
       #    response_text = result.get("answer", "Not found")
       #
       # 3. Call an external API:
       #    import requests
       #    resp = requests.post("https://api.example.com/chat",
       #                         json={"message": user_query})
       #    response_text = resp.json().get("reply")
       #
       # 4. Use a local ML model:
       #    from transformers import pipeline
       #    generator = pipeline("text-generation", model="gpt2")
       #    response_text = generator(user_query)[0]["generated_text"]
       #
       # ============================================================
      
       # Default: Echo the user's message (replace this!)
       response_text = f"Echo: {user_query}"
      
       # ============================================================
       # END OF YOUR CHATBOT LOGIC
       # ============================================================
      
       logging.info(f"Sending response: {response_text[:100]}...")
      
       return func.HttpResponse(
           json.dumps({"response": response_text}),
           status_code=200,
           mimetype="application/json"
       )
      
   except ValueError as e:
       logging.error(f"Invalid JSON in request: {e}")
       return func.HttpResponse(
           json.dumps({"error": "Invalid JSON in request body"}),
           status_code=400,
           mimetype="application/json"
       )
   except Exception as e:
       logging.error(f"Error processing request: {e}")
       return func.HttpResponse(
           json.dumps({"error": "Internal server error"}),
           status_code=500,
           mimetype="application/json"
       )




@app.route(route="health", methods=["GET"])
def health(req: func.HttpRequest) -> func.HttpResponse:
   """
   Health check endpoint.
  
   Returns a simple status to verify the function is running.
   This is optional but useful for monitoring.
   """
   return func.HttpResponse(
       json.dumps({"status": "healthy", "service": "lumina-chatbot-plugin"}),
       status_code=200,
       mimetype="application/json"
   )







