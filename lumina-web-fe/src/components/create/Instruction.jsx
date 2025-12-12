import React from "react";
import {
 Box,
 Checkbox,
 FormControlLabel,
 FormGroup,
 Typography,
} from "@mui/material";


const Instruction = ({ checked, setChecked }) => {
 return (
   <Box display="flex" flexDirection="column" gap={2}>
     <Typography variant="h4">
       Welcome to the Chatbot Deployment Guide! 🚀
     </Typography>
     <Typography variant="body1">
       This guide will walk you through the process of deploying your chatbot
       to the Lumina store.
     </Typography>
     <Typography variant="h5" fontWeight="bold">
       Step 1: Fill in your plugin details! 📝
     </Typography>
     <Typography variant="body1">
       Plugin details lets students learn more about your chatbot in Lumina
       Store! Fill in the details below to make your chatbot stand out and help
       students discover its value:
       <ul>
         <li>
           Name
           <ul>
             <li>Choose a catchy and descriptive name for your chatbot.</li>
             <li>
               If it’s tailored to a specific course, don’t forget to include
               the course code for easy access!
             </li>
           </ul>
         </li>
         <li>
           Category
           <ul>
             <li>Select the category that best represents your chatbot.</li>
             <li>Options include: Modules, Career, School, or General.</li>
           </ul>
         </li>
         <li>
           Description
           <ul>
             <li>
               Highlight what makes your chatbot unique and why students should
               give it a try! Make it compelling and informative.
             </li>
           </ul>
         </li>
         <li>
           Image
           <ul>
             <li>
               Upload an eye-catching image that visually represents your
               chatbot.
             </li>
           </ul>
         </li>
       </ul>
     </Typography>
     <Typography variant="h5" fontWeight="bold">
       Step 2: Fill in your plugin endpoint! 🌐
     </Typography>
     <Typography variant="body1">
       Plugin endpoint is where your chatbot lives! Fill in the details below
       to ensure a seamless integration with Lumina:
       <ul>
         <li>Server URL</li>
         <ul>
           <li>The base URL where the API is hosted.</li>
           <pre>
             Example:{" "}
             <code>{`"https://workshop-plugins.azurewebsites.net"`}</code>
           </pre>
         </ul>
         <li>Paths</li>
         <ul>
           <li>
             Relative endpoint path that Lumina will use to send user queries
             and receive responses.
           </li>
           <pre>
             Example: <code>{`"/api/cdefg-plugin"`}</code>
           </pre>
         </ul>


         <li>Request Body Format</li>
         <ul>
           <li>
             Format of the response (application/json, text/plain, etc.).
           </li>
           <pre>
             Example: <code>{`"application/json"`}</code>
           </pre>
         </ul>
         <li>Request Body Content Type</li>
         <ul>
           <li>Data type of the request payload</li>
           <pre>
             Example: <code>{`"object"`}</code>
           </pre>
         </ul>
         <li>Request Body Query Key</li>
         <ul>
           <li>Key of the property that contain user query</li>
           <pre>
             Example: <code>{`query`}</code>
           </pre>
         </ul>
         <li>Authentication Type (Optional)</li>
         <ul>
           <li>
             If your API requires authentication, select the appropriate type:
           </li>
           <ul>
             <li>
               <strong>None</strong> - Your API is publicly accessible (no
               authentication required)
             </li>
             <li>
               <strong>API Key</strong> - Your key will be sent in the{" "}
               <code>X-API-Key</code> header
             </li>
             <li>
               <strong>Bearer Token</strong> - Your token will be sent in the{" "}
               <code>Authorization: Bearer &lt;token&gt;</code> header
             </li>
           </ul>
         </ul>
         <li>API Key / Bearer Token</li>
         <ul>
           <li>
             If you selected API Key or Bearer Token authentication, enter your
             secret key or token here.
           </li>
           <li>
             <strong>Important:</strong> Your credentials are stored securely
             and will only be used when calling your endpoint.
           </li>
         </ul>
       </ul>
     </Typography>
     <Typography variant="h5" fontWeight="bold">
       Step 3: Review and submit! 💻
     </Typography>
     <Typography variant="body1">
       Review your plugin details and endpoint before submitting it to the
       Lumina store!
     </Typography>
     <Typography variant="h5" fontWeight="bold">
       Warning ⚠️
     </Typography>
     <Typography variant="body1">
       Do not upload models trained on sensitive data or inappropriate content
       that may cause harm. Plugins that are deemed inappropriate will be
       removed from the Lumina store. Your NTU email will be tagged with every
       plugin you submit.
     </Typography>
     <FormGroup>
       <FormControlLabel
         required
         control={
           <Checkbox
             checked={checked}
             onChange={(e) => setChecked(e.target.checked)}
           />
         }
         label="I have read and acknowledged the guide."
       />
     </FormGroup>
   </Box>
 );
};


export default Instruction;





