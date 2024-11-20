import React from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  Input,
  MuiFileInput,
} from "@mui/material";

const PluginDetailsForm = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Enter Plugin Details 📝</Typography>
      <Typography variant="body1">
        Plugin details lets students learn more about your chatbot in Lumina
        Store! Fill in the details below to make your chatbot stand out and help
        students discover its value:
      </Typography>
      <FormControl>
        <TextField label={"Name of plugin"} />
      </FormControl>
    </Box>
  );
};

export default PluginDetailsForm;
