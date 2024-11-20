import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";

const Instruction = () => {
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
            Name:
            <ul>
              <li>Choose a catchy and descriptive name for your chatbot.</li>
              <li>
                If it’s tailored to a specific course, don’t forget to include
                the course code for easy access!
              </li>
            </ul>
          </li>
          <li>
            Category:
            <ul>
              <li>Select the category that best represents your chatbot.</li>
              <li>Options include: Modules, Career, School, or General.</li>
            </ul>
          </li>
          <li>
            Description:
            <ul>
              <li>
                Highlight what makes your chatbot unique and why students should
                give it a try! Make it compelling and informative.
              </li>
            </ul>
          </li>
          <li>
            Image:
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
        Plugin endpoint is where your chatbot lives! Make sure to provide the
        correct endpoint so students can interact with your chatbot!
        <ul>
          <li>
            Your fine-tuned models and any complementary knowledge bases should
            have been deployed to cloud prior to adding to Lumina Store.
          </li>
          <li>
            Provide the single endpoint to call to generate response from the
            model.
          </li>
          <li>
            Specify the format of the request and response clearly.
            <ul>
              <li>For request:</li>
              <ul>
                <li>Choose request type: GET, PUT, POST</li>
                <li>
                  Specify the expected response format: via request body or
                  parameters
                </li>
                <li>Specify the key to which the response is tagged to</li>
              </ul>
              <li>For response:</li>
              <ul>
                <li>Choose response type: JSON, XML, HTML</li>
                <li>Specify the key to which the response is tagged to</li>
              </ul>
            </ul>
          </li>
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
        removed from the Lumina store. Your NTU email will tagged with every
        plugin you submit.
      </Typography>
      <FormGroup>
        <FormControlLabel
          required
          control={<Checkbox />}
          label="I have read and acknowledge the guide."
        />
      </FormGroup>
    </Box>
  );
};

export default Instruction;
