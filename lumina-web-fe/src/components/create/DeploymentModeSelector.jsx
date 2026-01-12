import React, { useState, useCallback } from "react";
import {
 Box,
 Typography,
 ToggleButton,
 ToggleButtonGroup,
 Paper,
 Button,
 Alert,
 CircularProgress,
 Chip,
 Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import axios from "../../config/axiosConfig";


const DeploymentModeSelector = ({
 deploymentType,
 setDeploymentType,
 zipFile,
 setZipFile,
 zipValidation,
 setZipValidation,
 isValidating,
 setIsValidating,
}) => {
 const [dragActive, setDragActive] = useState(false);


 const handleModeChange = (event, newMode) => {
   if (newMode !== null) {
     setDeploymentType(newMode);
     // Reset zip file when switching modes
     if (newMode === "external") {
       setZipFile(null);
       setZipValidation(null);
     }
   }
 };


 const validateZipFile = async (file) => {
   setIsValidating(true);
   setZipValidation(null);


   try {
     const formData = new FormData();
     formData.append("file", file);


     const response = await axios.post("/api/deploy/validate", formData, {
       headers: { "Content-Type": "multipart/form-data" },
     });


     setZipValidation({
       valid: response.data.success,
       errors: response.data.errors || [],
       warnings: response.data.warnings || [],
       fileCount: response.data.fileCount,
     });
   } catch (error) {
     setZipValidation({
       valid: false,
       errors: [error.response?.data?.error || "Validation failed"],
       warnings: [],
       fileCount: 0,
     });
   } finally {
     setIsValidating(false);
   }
 };


 const handleFileSelect = (event) => {
   const file = event.target.files?.[0];
   if (file && file.name.endsWith(".zip")) {
     setZipFile(file);
     validateZipFile(file);
   }
 };


 const handleDrag = useCallback((e) => {
   e.preventDefault();
   e.stopPropagation();
   if (e.type === "dragenter" || e.type === "dragover") {
     setDragActive(true);
   } else if (e.type === "dragleave") {
     setDragActive(false);
   }
 }, []);


 const handleDrop = useCallback((e) => {
   e.preventDefault();
   e.stopPropagation();
   setDragActive(false);


   const file = e.dataTransfer.files?.[0];
   if (file && file.name.endsWith(".zip")) {
     setZipFile(file);
     validateZipFile(file);
   }
 }, []);


 return (
   <Box display="flex" flexDirection="column" gap={3}>
     <Typography variant="h6">Deployment Mode</Typography>
     <Typography variant="body2" color="text.secondary">
       Choose how you want to deploy your plugin. You can either upload your
       Azure Function code for managed deployment, or provide an external
       endpoint URL.
     </Typography>


     <ToggleButtonGroup
       value={deploymentType}
       exclusive
       onChange={handleModeChange}
       fullWidth
       sx={{ mb: 2 }}
     >
       <Tooltip title="Let Lumina deploy and manage your Azure Function">
         <ToggleButton value="managed" sx={{ py: 2 }}>
           <CloudUploadIcon sx={{ mr: 1 }} />
           Managed Deployment
         </ToggleButton>
       </Tooltip>
       <Tooltip title="Use your own hosted endpoint">
         <ToggleButton value="external" sx={{ py: 2 }}>
           <LinkIcon sx={{ mr: 1 }} />
           External Endpoint
         </ToggleButton>
       </Tooltip>
     </ToggleButtonGroup>


     {deploymentType === "managed" && (
       <Box>
         <Paper
           variant="outlined"
           onDragEnter={handleDrag}
           onDragLeave={handleDrag}
           onDragOver={handleDrag}
           onDrop={handleDrop}
           sx={{
             p: 4,
             textAlign: "center",
             cursor: "pointer",
             border: dragActive ? "2px dashed primary.main" : "2px dashed grey.400",
             bgcolor: dragActive ? "action.hover" : "background.paper",
             transition: "all 0.2s ease",
             "&:hover": { bgcolor: "action.hover" },
           }}
         >
           <input
             type="file"
             accept=".zip"
             onChange={handleFileSelect}
             style={{ display: "none" }}
             id="zip-file-input"
           />
           <label htmlFor="zip-file-input" style={{ cursor: "pointer" }}>
             <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
             <Typography variant="h6" gutterBottom>
               {zipFile ? zipFile.name : "Drop your Azure Function zip here"}
             </Typography>
             <Typography variant="body2" color="text.secondary">
               or click to browse
             </Typography>
             <Typography variant="caption" display="block" color="text.secondary" mt={1}>
               Required files: function_app.py, requirements.txt, host.json
             </Typography>
           </label>
         </Paper>


         {isValidating && (
           <Box display="flex" alignItems="center" gap={1} mt={2}>
             <CircularProgress size={20} />
             <Typography>Validating zip structure...</Typography>
           </Box>
         )}


         {zipValidation && !isValidating && (
           <Box mt={2}>
             {zipValidation.valid ? (
               <Alert severity="success" icon={<CheckCircleIcon />}>
                 <Typography fontWeight="bold">Validation Passed</Typography>
                 <Typography variant="body2">
                   {zipValidation.fileCount} files found. Ready for deployment.
                 </Typography>
               </Alert>
             ) : (
               <Alert severity="error">
                 <Typography fontWeight="bold">Validation Failed</Typography>
                 {zipValidation.errors.map((err, i) => (
                   <Typography key={i} variant="body2">• {err}</Typography>
                 ))}
               </Alert>
             )}


             {zipValidation.warnings?.length > 0 && (
               <Alert severity="warning" sx={{ mt: 1 }} icon={<WarningIcon />}>
                 <Typography fontWeight="bold">Warnings</Typography>
                 {zipValidation.warnings.map((warn, i) => (
                   <Typography key={i} variant="body2">• {warn}</Typography>
                 ))}
               </Alert>
             )}
           </Box>
         )}
       </Box>
     )}


     {deploymentType === "external" && (
       <Alert severity="info">
         You'll configure your external endpoint URL in the next step.
       </Alert>
     )}
   </Box>
 );
};


export default DeploymentModeSelector;





