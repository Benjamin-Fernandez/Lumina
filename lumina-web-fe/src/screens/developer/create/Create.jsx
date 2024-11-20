import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { useState } from "react";
import * as React from "react";
import { tokens } from "../../../theme";
import Instruction from "../../../components/create/Instruction";
import PluginDetailsForm from "../../../components/create/PluginDetailsForm";
import PluginEndpointForm from "../../../components/create/PluginEndpointForm";
import ReviewForm from "../../../components/create/ReviewForm";

const Create = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const steps = [
    "Instructions",
    "Enter Plugin Details",
    "Enter Plugin Endpoint",
    "Review and Submit",

    //   { label: "Enter Plugin Details", component: <PluginDetailsForm /> },
    //   { label: "Enter Plugin Endpoint", component: <PluginEndpointForm /> },
    //   { label: "Review and Submit", component: <ReviewForm /> },
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [requestType, setRequestType] = useState("");
  const [responseType, setResponseType] = useState("");
  const [requestFormat, setRequestFormat] = useState("");
  const [requestKey, setRequestKey] = useState("");
  const [responseKey, setResponseKey] = useState("");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      py={4}
      px={4}
      mx={4}
      height="80%"
      width="95%"
      border={1}
      borderRadius={2}
      borderColor={colors.grey[800]}
      display="flex"
      flexDirection="column"
    >
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} sx={{ mb: "20px" }}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Box p={2} display="flex" flexDirection="column">
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                You're all set! 🎉
              </Typography>
              <Typography variant="h5">
                Your plugin has been successfully submitted to the Lumina store!
              </Typography>
              <Typography variant="h5">
                Thank you for contributing to the big Lumina ecosystem!🥰
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button>Done</Button>
              </Box>
            </React.Fragment>
          ) : activeStep === 0 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <Instruction />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : activeStep === 1 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <PluginDetailsForm
                file={file}
                name={name}
                category={category}
                description={description}
                setFile={setFile}
                setName={setName}
                setCategory={setCategory}
                setDescription={setDescription}
              />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : activeStep === 2 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <PluginEndpointForm
                endpoint={endpoint}
                requestType={requestType}
                responseType={responseType}
                requestFormat={requestFormat}
                requestKey={requestKey}
                responseKey={responseKey}
                setEndpoint={setEndpoint}
                setRequestType={setRequestType}
                setResponseType={setResponseType}
                setRequestFormat={setRequestFormat}
                setRequestKey={setRequestKey}
                setResponseKey={setResponseKey}
              />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : activeStep === 3 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <ReviewForm
                file={file}
                name={name}
                category={category}
                description={description}
                endpoint={endpoint}
                requestType={requestType}
                responseType={responseType}
                requestFormat={requestFormat}
                requestKey={requestKey}
                responseKey={responseKey}
              />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Create;
