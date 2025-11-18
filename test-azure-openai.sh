#!/bin/bash


# Test Azure OpenAI Configuration
# This script helps you test if your Azure OpenAI setup is correct


echo "🔍 Azure OpenAI Configuration Tester"
echo "===================================="
echo ""


# Check if environment variables are set
if [ -z "$AZURE_OPENAI_API_BASE" ]; then
   echo "❌ AZURE_OPENAI_API_BASE is not set"
   echo ""
   echo "Please set it:"
   echo "export AZURE_OPENAI_API_BASE='https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions'"
   echo ""
   exit 1
fi


if [ -z "$AZURE_OPENAI_APIVERSION" ]; then
   echo "❌ AZURE_OPENAI_APIVERSION is not set"
   echo ""
   echo "Please set it:"
   echo "export AZURE_OPENAI_APIVERSION='2024-02-15-preview'"
   echo ""
   exit 1
fi


if [ -z "$AZURE_OPENAI_APIKEY" ]; then
   echo "❌ AZURE_OPENAI_APIKEY is not set"
   echo ""
   echo "Please set it:"
   echo "export AZURE_OPENAI_APIKEY='your-api-key-here'"
   echo ""
   exit 1
fi


echo "✅ Environment variables are set"
echo ""
echo "📋 Configuration:"
echo "  API Base: $AZURE_OPENAI_API_BASE"
echo "  API Version: $AZURE_OPENAI_APIVERSION"
echo "  API Key: ${AZURE_OPENAI_APIKEY:0:10}... (length: ${#AZURE_OPENAI_APIKEY})"
echo ""


# Construct the full URL
FULL_URL="${AZURE_OPENAI_API_BASE}?api-version=${AZURE_OPENAI_APIVERSION}"


echo "🚀 Testing Azure OpenAI endpoint..."
echo "  URL: $FULL_URL"
echo ""


# Make the request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$FULL_URL" \
 -H "Content-Type: application/json" \
 -H "api-key: $AZURE_OPENAI_APIKEY" \
 -d '{
   "messages": [
     {"role": "user", "content": "Say hello in one word"}
   ]
 }')


# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)


# Extract response body (everything except last line)
BODY=$(echo "$RESPONSE" | sed '$d')


echo "📊 Response:"
echo "  HTTP Status: $HTTP_CODE"
echo ""


if [ "$HTTP_CODE" = "200" ]; then
   echo "✅ SUCCESS! Azure OpenAI is working correctly!"
   echo ""
   echo "Response body:"
   echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
   echo ""
   echo "🎉 Your configuration is correct!"
   echo ""
   echo "Next steps:"
   echo "1. Add these environment variables to Azure App Service"
   echo "2. Restart the App Service"
   echo "3. Test the mobile app"
else
   echo "❌ ERROR! Azure OpenAI returned status $HTTP_CODE"
   echo ""
   echo "Response body:"
   echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
   echo ""
   echo "🔍 Troubleshooting:"
  
   if [ "$HTTP_CODE" = "404" ]; then
       echo ""
       echo "404 Not Found - Possible causes:"
       echo "  1. Wrong deployment name in URL"
       echo "  2. Deployment doesn't exist"
       echo "  3. Wrong API version"
       echo ""
       echo "Check your Azure OpenAI deployment:"
       echo "  Azure Portal → Azure OpenAI → Deployments"
       echo "  Copy the exact deployment name"
       echo ""
       echo "URL format should be:"
       echo "  https://<resource>.openai.azure.com/openai/deployments/<deployment-name>/chat/completions"
   elif [ "$HTTP_CODE" = "401" ]; then
       echo ""
       echo "401 Unauthorized - Possible causes:"
       echo "  1. Wrong API key"
       echo "  2. API key expired or regenerated"
       echo ""
       echo "Get your API key:"
       echo "  Azure Portal → Azure OpenAI → Keys and Endpoint"
   elif [ "$HTTP_CODE" = "429" ]; then
       echo ""
       echo "429 Too Many Requests - Rate limit exceeded"
       echo "  Wait a few minutes and try again"
   else
       echo ""
       echo "Check the response body above for more details"
   fi
fi


echo ""
echo "===================================="







