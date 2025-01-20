import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useState, useEffect, useRef } from "react";
import * as React from "react";
import { tokens } from "../../../theme";
import Instruction from "../../../components/create/Instruction";
import PluginDetailsForm from "../../../components/create/PluginDetailsForm";
import PluginEndpointForm from "../../../components/create/PluginEndpointForm";
import ReviewForm from "../../../components/create/ReviewForm";
import TestEndpoint from "../../../components/create/TestEndpoint";
import axios from "../../../config/axiosConfig";
import * as yaml from "js-yaml";
import testEndpoint from "../../../helpers/TestEndpoint";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const Create = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const steps = [
    "Instructions",
    "Enter Plugin Details",
    "Enter Plugin Endpoint",
    "Test Plugin Endpoint",
    "Review and Submit",

    //   { label: "Enter Plugin Details", component: <PluginDetailsForm /> },
    //   { label: "Enter Plugin Endpoint", component: <PluginEndpointForm /> },
    //   { label: "Review and Submit", component: <ReviewForm /> },
  ];
  const Navigate = useNavigate();
  const email = useMsal().instance.getActiveAccount().username;
  const formRef = useRef();

  const [checked, setChecked] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [endpointSuccess, setEndpointSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [yamlFile, setYamlFile] = useState(null);
  const [yamlString, setYamlString] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [path, setPath] = useState("");
  const [requestFormat, setRequestFormat] = useState("");
  const [requestBodyQueryKey, setRequestBodyQueryKey] = useState("");
  const [requestContentType, setRequestContentType] = useState("");

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeStep]);

  useEffect(() => {
    setEndpointSuccess(false);
  }, [endpoint, path, requestFormat, requestBodyQueryKey, requestContentType]);

  useEffect(() => {
    setRequestBodyQueryKey("");
    setRequestContentType("");
  }, [requestFormat]);

  const generateYaml = ({
    name,
    endpoint,
    path,
    requestFormat,
    requestContentType,
    requestBodyQueryKey,
  }) => {
    let yamlObject = {};
    if (requestFormat == "application/json") {
      yamlObject = {
        openapi: "3.0.0",
        info: {
          title: name + "API",
          version: "1.0.0",
        },
        servers: [
          {
            url: endpoint, // Base URL can be dynamic, for now using the example
          },
        ],
        paths: {
          [path]: {
            // Dynamic path
            post: {
              operationId: "getResponse", // Example operationId based on method and path
              requestBody: {
                required: true, // Convert to boolean
                content: {
                  [requestFormat]: {
                    schema: {
                      type: requestContentType,
                      properties: requestBodyQueryKey,
                    },
                  },
                },
              },
              responses: {
                200: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "string", // Default type to string if not provided
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      // Convert the JavaScript object to a YAML string
      const yamlString = yaml.dump(yamlObject);

      return yamlString;
    } else {
      yamlObject = {
        openapi: "3.0.0",
        info: {
          title: name + "API",
          version: "1.0.0",
        },
        servers: [
          {
            url: endpoint, // Base URL can be dynamic, for now using the example
          },
        ],
        paths: {
          [path]: {
            // Dynamic path
            post: {
              operationId: "getResponse", // Example operationId based on method and path
              requestBody: {
                required: true, // Convert to boolean
                content: {
                  [requestFormat]: {
                    schema: {
                      type: "string",
                    },
                  },
                },
              },
              responses: {
                200: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "string", // Default type to string if not provided
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Convert the JavaScript object to a YAML string
      const yamlString = yaml.dump(yamlObject);

      return yamlString;
    }
  };

  const handleSubmit = () => {
    console.log("Retrieving user information...");
    console.log("User email:", email);
    axios
      .get("/user/email/" + email)
      .then((res) => {
        console.log("Sending data:", {
          userEmail: email,
          userName: res.data.user.name,
          name: name,
          version: "1.0.0",
          image: base64,
          category: category,
          description: description,
          activated: false,
          schema: JSON.stringify(yamlString),
          endpoint: endpoint,
          path: path,
          requestBodyQueryKey: requestBodyQueryKey,
          requestFormat: requestFormat,
          requestContentType: requestContentType,
        });
        axios
          .post("/plugin/", {
            userEmail: email,
            userName: res.data.user.name,
            name: name,
            version: "1.0.0",
            image: base64,
            category: category,
            description: description,
            activated: true, // will change to true once deployed
            schema: yamlString,
            endpoint: endpoint,
            path: path,
            requestBodyQueryKey: requestBodyQueryKey,
            requestFormat: requestFormat,
            requestContentType: requestContentType,
          })
          .then(() => {
            console.log("Plugin submitted successfully!");
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          })
          .catch((error) => {
            console.error("Error submitting plugin:", error);
          });
      })
      .catch((error) => {
        console.error("Error submitting plugin:", error);
      });
  };

  const handleNext = () => {
    if (activeStep === 2 && yamlFile === null) {
      console.log(
        "Generating YAML file... with endpoint:",
        endpoint,
        "path:",
        path,
        "requestFormat:",
        requestFormat,
        "requestContentType:",
        requestContentType,
        "requestBodyQueryKey:",
        requestBodyQueryKey
      );
      const yamlString = generateYaml({
        name,
        endpoint,
        path,
        requestFormat,
        requestContentType,
        requestBodyQueryKey,
      });
      setYamlString(yamlString);
      console.log("Generated YAML file:", yamlString);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleDone = () => {
    Navigate("/pluginDev");
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
                <Button onClick={handleDone}>Done</Button>
              </Box>
            </React.Fragment>
          ) : activeStep === 0 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <Instruction checked={checked} setChecked={setChecked} />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {/* <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button> */}
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext} disabled={!checked}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : activeStep === 1 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <PluginDetailsForm
                formRef={formRef}
                file={file}
                base64={base64}
                name={name}
                category={category}
                description={description}
                setFile={setFile}
                setBase64={setBase64}
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
                formRef={formRef}
                yamlFile={yamlFile}
                endpoint={endpoint}
                path={path}
                requestFormat={requestFormat}
                requestContentType={requestContentType}
                requestBodyQueryKey={requestBodyQueryKey}
                setYamlFile={setYamlFile}
                setEndpoint={setEndpoint}
                setPath={setPath}
                setRequestFormat={setRequestFormat}
                setRequestContentType={setRequestContentType}
                setRequestBodyQueryKey={setRequestBodyQueryKey}
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
                    !(endpoint !== "" && path !== "" && requestFormat !== "")
                  }
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : activeStep === 3 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <TestEndpoint
                testEndpoint={testEndpoint}
                yamlString={yamlString}
                setEndpointSuccess={setEndpointSuccess}
                path={path}
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
                <Button onClick={handleNext} disabled={!endpointSuccess}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          ) : activeStep === 4 ? (
            <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
              <ReviewForm //TODO
                formRef={formRef}
                file={file}
                name={name}
                category={category}
                description={description}
                yamlFile={yamlFile}
                endpoint={endpoint}
                path={path}
                requestBodyQueryKey={requestBodyQueryKey}
                requestFormat={requestFormat}
                requestContentType={requestContentType}
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
                <Button onClick={handleSubmit}>
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
