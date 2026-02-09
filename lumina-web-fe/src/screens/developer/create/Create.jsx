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
import DeploymentModeSelector from "../../../components/create/DeploymentModeSelector";
import Loading from "../../global/Loading";
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
const { instance } = useMsal();
const account = instance.getActiveAccount();
const email = account?.username;
const accountName = account?.name || "Unknown User";
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
const [authType, setAuthType] = useState("none");
const [apiKey, setApiKey] = useState("");
const [loading, setLoading] = useState(false);




// Deployment state
const [deploymentType, setDeploymentType] = useState("external");
const [zipFile, setZipFile] = useState(null);
const [zipValidation, setZipValidation] = useState(null);
const [isValidating, setIsValidating] = useState(false);
const [isDeploying, setIsDeploying] = useState(false);
















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
                  properties: {
                    [requestBodyQueryKey]: {
                      type: "string",
                    },
                  },
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
















const handleSubmit = async () => {
setLoading(true);
try {
  const userRes = await axios.get("/user/email/" + email);


  // Get user name with fallback - handle case where user exists but name is missing
  const existingUser = userRes.data.user;
  let userName = existingUser?.name;


  // If user doesn't exist or name is missing, get from MSAL account
  if (!userName) {
    let msalName = accountName;
    // Clean up name if wrapped in quotes
    if (msalName.startsWith('"') && msalName.endsWith('"')) {
      msalName = msalName.slice(1, -1);
    }
    userName = msalName || "Unknown User";
  }




  // First create the plugin
  const pluginData = {
    userEmail: email,
    userName: userName,
    name: name,
    version: "1.0.0",
    image: base64,
    category: category,
    description: description,
    activated: deploymentType === "external", // Only active if external (managed needs deployment)
    schema: yamlString,
    endpoint: deploymentType === "external" ? endpoint : "", // Will be set after deployment
    path: deploymentType === "external" ? path : "/api/http_trigger",
    requestBodyQueryKey: requestBodyQueryKey,
    requestFormat: requestFormat || "application/json",
    requestContentType: requestContentType || "object",
    authType: authType,
    apiKey: apiKey,
    deploymentType: deploymentType,
  };




  const pluginRes = await axios.post("/plugin/", pluginData);
  const pluginId = pluginRes.data.plugin._id;




  // If managed deployment, deploy the zip file
  if (deploymentType === "managed" && zipFile) {
    setIsDeploying(true);
    const formData = new FormData();
    formData.append("file", zipFile);
    formData.append("userEmail", email); // Required for authorization




    try {
      const deployRes = await axios.post(`/api/deploy/${pluginId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });




      if (!deployRes.data.success) {
        console.error("Deployment failed:", deployRes.data.error);
      }
    } catch (deployError) {
      console.error("Deployment error:", deployError);
      // Plugin is created but deployment failed - user can retry later
    } finally {
      setIsDeploying(false);
    }
  }




  setActiveStep((prevActiveStep) => prevActiveStep + 1);
  setLoading(false);
} catch (error) {
  console.error("Error submitting plugin:", error);
  setLoading(false);
}
};
















const handleNext = () => {
if (activeStep === 2 && yamlFile === null) {
  // For managed deployment, use placeholder values for yaml
  const yamlEndpoint = deploymentType === "managed" ? "https://placeholder.azurewebsites.net" : endpoint;
  const yamlPath = deploymentType === "managed" ? "/api/http_trigger" : path;
  const yamlRequestFormat = deploymentType === "managed" ? "application/json" : requestFormat;
  const yamlRequestContentType = deploymentType === "managed" ? "object" : requestContentType;
  const yamlRequestBodyQueryKey = deploymentType === "managed" ? "query" : requestBodyQueryKey;




  const generatedYaml = generateYaml({
    name,
    endpoint: yamlEndpoint,
    path: yamlPath,
    requestFormat: yamlRequestFormat,
    requestContentType: yamlRequestContentType,
    requestBodyQueryKey: yamlRequestBodyQueryKey,
  });
  setYamlString(generatedYaml);
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
              disabled={!(name !== "" && category !== "" && description !== "")}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      ) : activeStep === 2 ? (
        <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
          {/* Deployment Mode Selection */}
          <DeploymentModeSelector
            deploymentType={deploymentType}
            setDeploymentType={setDeploymentType}
            zipFile={zipFile}
            setZipFile={setZipFile}
            zipValidation={zipValidation}
            setZipValidation={setZipValidation}
            isValidating={isValidating}
            setIsValidating={setIsValidating}
          />




          {/* Only show endpoint form for external deployment */}
          {deploymentType === "external" && (
            <Box mt={3}>
              <PluginEndpointForm
                formRef={formRef}
                yamlFile={yamlFile}
                endpoint={endpoint}
                path={path}
                requestFormat={requestFormat}
                requestContentType={requestContentType}
                requestBodyQueryKey={requestBodyQueryKey}
                authType={authType}
                apiKey={apiKey}
                setYamlFile={setYamlFile}
                setEndpoint={setEndpoint}
                setPath={setPath}
                setRequestFormat={setRequestFormat}
                setRequestContentType={setRequestContentType}
                setRequestBodyQueryKey={setRequestBodyQueryKey}
                setAuthType={setAuthType}
                setApiKey={setApiKey}
              />
            </Box>
          )}




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
                deploymentType === "managed"
                  ? !(zipFile && zipValidation?.valid)
                  : !(endpoint !== "" && path !== "" && requestFormat !== "")
              }
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      ) : activeStep === 3 ? (
        <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
          {deploymentType === "managed" ? (
            <Box>
              <Typography ref={formRef} variant="h4" gutterBottom>
                Managed Deployment Preview 🚀
              </Typography>
              <Typography variant="body1" gutterBottom>
                Your Azure Function will be deployed automatically when you submit.
              </Typography>
              <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                <Typography variant="body2"><strong>File:</strong> {zipFile?.name}</Typography>
                <Typography variant="body2"><strong>Files validated:</strong> {zipValidation?.fileCount}</Typography>
                <Typography variant="body2"><strong>Status:</strong> Ready for deployment</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Note: Endpoint testing will be available after deployment completes.
              </Typography>
            </Box>
          ) : (
            <TestEndpoint
              testEndpoint={testEndpoint}
              yamlString={yamlString}
              setEndpointSuccess={setEndpointSuccess}
              path={path}
            />
          )}
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
              disabled={deploymentType === "external" && !endpointSuccess}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      ) : activeStep === 4 && !loading ? (
        <Box sx={{ overflowY: "auto", height: "60vh" }} px={2}>
          <ReviewForm
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
            deploymentType={deploymentType}
            zipFile={zipFile}
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
      ) : activeStep === 4 && (loading || isDeploying) ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Loading />
          {isDeploying && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Deploying your Azure Function... This may take a few minutes.
            </Typography>
          )}
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


















