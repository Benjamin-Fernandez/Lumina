import React from "react";
import { Box, Divider, Typography, Link, Chip } from "@mui/material";
import { Grid } from "@mui/system";
import { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";


const ReviewForm = ({
 formRef,
 file,
 name,
 category,
 description,
 yamlFile,
 endpoint,
 path,
 requestFormat,
 requestContentType,
 requestBodyQueryKey,
 deploymentType,
 zipFile,
}) => {
 const [imageSrc, setImageSrc] = useState("");
 useEffect(() => {
   if (file) {
     const reader = new FileReader();
     reader.onloadend = () => {
       setImageSrc(reader.result);
     };
     reader.readAsDataURL(file);
   }
 }, [file]);


 return (
   <Box display="flex" flexDirection="column" gap={2}>
     <Typography ref={formRef} variant="h4">
       Review and submit! 💻
     </Typography>
     <Typography variant="body1">
       Review your plugin details and endpoint before submitting it to the
       Lumina store!
     </Typography>
     <Typography variant="h5" fontWeight="bold">
       Plugin Details
     </Typography>
     <Grid container spacing={2}>
       <Grid item size={2} my={2}>
         {imageSrc && (
           <Box
             component="img"
             src={imageSrc}
             height="120px"
             width="120px"
             borderRadius="50%"
             objectFit="cover"
             alt="plugin"
           />
         )}
       </Grid>
       <Grid item size={10} mt={3} display="flex" flexDirection="column">
         <Grid container gap={2} display="flex" flexDirection="column">
           <Box display="flex" flexDirection="row" gap={2}>
             <Typography variant="body1" fontWeight="bold">
               Name:{" "}
             </Typography>
             <Typography variant="body1">{name}</Typography>
           </Box>
           <Box display="flex" flexDirection="row" gap={2}>
             <Typography variant="body1" fontWeight="bold">
               Category:
             </Typography>
             <Typography variant="body1">{category}</Typography>
           </Box>
           <Box display="flex" flexDirection="row" gap={2}>
             <Typography variant="body1" fontWeight="bold">
               Description:{" "}
             </Typography>
             <Typography variant="body1">{description}</Typography>
           </Box>
         </Grid>
       </Grid>
     </Grid>
     <Divider />
     <Typography variant="h5" fontWeight="bold">
       Deployment & Endpoint
     </Typography>


     {/* Deployment Type Indicator */}
     <Box display="flex" flexDirection="row" gap={2} alignItems="center">
       <Typography variant="body1" fontWeight="bold">
         Deployment Mode:
       </Typography>
       {deploymentType === "managed" ? (
         <Chip
           icon={<CloudUploadIcon />}
           label="Managed Deployment"
           color="primary"
           size="small"
         />
       ) : (
         <Chip
           icon={<LinkIcon />}
           label="External Endpoint"
           color="secondary"
           size="small"
         />
       )}
     </Box>


     {/* Show managed deployment info */}
     {deploymentType === "managed" && zipFile && (
       <Box display="flex" flexDirection="column" gap={2}>
         <Box display="flex" flexDirection="row" gap={2}>
           <Typography variant="body1" fontWeight="bold">
             Deployment Package:
           </Typography>
           <Typography variant="body1">{zipFile.name}</Typography>
         </Box>
         <Box display="flex" flexDirection="row" gap={2}>
           <Typography variant="body1" fontWeight="bold">
             Default Path:
           </Typography>
           <Typography variant="body1">/api/http_trigger</Typography>
         </Box>
         <Typography variant="body2" color="text.secondary">
           Your endpoint URL will be generated after deployment.
         </Typography>
       </Box>
     )}


     {/* Show external endpoint info */}
     {deploymentType === "external" && !yamlFile && (
       <Box display="flex" flexDirection="column" gap={2}>
         <Box display="flex" flexDirection="row" gap={2}>
           <Typography variant="body1" fontWeight="bold">
             Server URL:
           </Typography>
           <Typography variant="body1">{endpoint}</Typography>
         </Box>
         <Box display="flex" flexDirection="row" gap={2}>
           <Typography variant="body1" fontWeight="bold">
             Path:
           </Typography>
           <Typography variant="body1"> {path}</Typography>
         </Box>
         <Box display="flex" flexDirection="row" gap={2}>
           <Typography variant="body1" fontWeight="bold">
             Request Format:
           </Typography>
           <Typography variant="body1">{requestFormat}</Typography>
         </Box>
         {requestFormat === "application/json" && (
           <Box display="flex" flexDirection="row" gap={2}>
             <Typography variant="body1" fontWeight="bold">
               Request Body Content Type:
             </Typography>
             <Typography variant="body1">{requestContentType}</Typography>
           </Box>
         )}
         {requestFormat === "application/json" && (
           <Box display="flex" flexDirection="row" gap={2}>
             <Typography variant="body1" fontWeight="bold">
               Request Body Schema:
             </Typography>
             <Typography variant="body1">{requestBodyQueryKey}</Typography>
           </Box>
         )}
       </Box>
     )}
   </Box>
 );
};


export default ReviewForm;





