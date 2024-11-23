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
  const [checked, setChecked] = useState();
  const [activeStep, setActiveStep] = React.useState(0);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [path, setPath] = useState("");
  const [httpMethod, setHttpMethod] = useState("");
  const [parametersRequired, setParametersRequired] = useState("false");
  const [parameters, setParameters] = useState("");
  const [requestBodyRequired, setRequestBodyRequired] = useState("false");
  const [requestFormat, setRequestFormat] = useState("");
  const [requestBodySchema, setRequestBodySchema] = useState("");
  const [requestContentType, setRequestContentType] = useState("");
  const [responseStatusCode, setResponseStatusCode] = useState("");
  const [responseContentType, setResponseContentType] = useState("");
  const [responseSchema, setResponseSchema] = useState("");

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
              <Typography variant="h2" sx={{ my: 5, alignSelf: "center" }}>
                You're all set! 🎉
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, alignSelf: "center" }}>
                Your plugin has been successfully submitted to the Lumina store!
              </Typography>
              <Typography variant="h5" sx={{ alignSelf: "center" }}>
                Thank you for contributing to the big Lumina ecosystem!🥰
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button>Done</Button>
              </Box>
            </React.Fragment>
          ) : activeStep === 0 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <Instruction checked={checked} setChecked={setChecked} />
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
                <Button onClick={handleNext} disabled={!checked}>
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
                <Button
                  onClick={handleNext}
                  disabled={
                    !(
                      file !== null &&
                      name !== "" &&
                      category !== "" &&
                      description !== ""
                    )
                  }
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : activeStep === 2 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <PluginEndpointForm
                endpoint={endpoint}
                path={path}
                httpMethod={httpMethod}
                parametersRequired={parametersRequired}
                parameters={parameters}
                requestBodyRequired={requestBodyRequired}
                requestFormat={requestFormat}
                requestContentType={requestContentType}
                requestBodySchema={requestBodySchema}
                responseStatusCode={responseStatusCode}
                responseContentType={responseContentType}
                responseSchema={responseSchema}
                setEndpoint={setEndpoint}
                setPath={setPath}
                setHttpMethod={setHttpMethod}
                setParametersRequired={setParametersRequired}
                setParameters={setParameters}
                setRequestBodyRequired={setRequestBodyRequired}
                setRequestFormat={setRequestFormat}
                setRequestContentType={setRequestContentType}
                setRequestBodySchema={setRequestBodySchema}
                setResponseStatusCode={setResponseStatusCode}
                setResponseContentType={setResponseContentType}
                setResponseSchema={setResponseSchema}
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
                <Button
                  onClick={handleNext}
                  disabled={
                    !(
                      endpoint !== "" &&
                      path !== "" &&
                      httpMethod !== "" &&
                      responseStatusCode !== "" &&
                      responseContentType !== "" &&
                      responseSchema !== "" &&
                      (parametersRequired !== "true" || parameters !== "") &&
                      (requestBodyRequired !== "true" ||
                        (requestFormat !== "" &&
                          requestContentType !== "" &&
                          requestBodySchema !== ""))
                    )
                  }
                >
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
                path={path}
                httpMethod={httpMethod}
                parametersRequired={parametersRequired}
                parameters={parameters}
                requestBodyRequired={requestBodyRequired}
                requestFormat={requestFormat}
                requestContentType={requestContentType}
                responseStatusCode={responseStatusCode}
                responseContentType={responseContentType}
                responseSchema={responseSchema}
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
