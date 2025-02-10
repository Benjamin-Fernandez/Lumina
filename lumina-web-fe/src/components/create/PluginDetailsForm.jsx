import React from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Avatar,
} from "@mui/material";
import { Grid } from "@mui/system";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginFileValidateType
);

const PluginDetailsForm = ({
  formRef,
  file,
  base64,
  name,
  category,
  description,
  setFile,
  setBase64,
  setName,
  setCategory,
  setDescription,
}) => {
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  const [charCount, setCharCount] = React.useState(name.length);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setCharCount(e.target.value.length);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size exceeds 1MB. Please upload a smaller file.");
      e.target.value = null;
      return;
    }
    if (selectedFile) {
      setFile(selectedFile);
      // console.log(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
        // console.log(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      alignContent="center"
      justifyContent="center"
    >
      <Typography variant="h4" ref={formRef}>
        Enter Plugin Details 📝
      </Typography>
      <Typography variant="body1">
        Plugin details lets students learn more about your chatbot in Lumina
        Store! Fill in the details below to make your chatbot stand out and help
        students discover its value:
      </Typography>
      <Grid container spacing={2} mb="15px" justifyContent="center">
        <Grid item xs={12} display="flex" justifyContent="center">
          {/* Avatar Selector */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body1" marginBottom="1rem">
              Plugin Image *
            </Typography>
            <input
              accept="image/*"
              type="file"
              id="file-upload"
              hidden
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <IconButton
                component="span"
                sx={{ width: "120px", height: "120px" }}
              >
                {file ? (
                  <Avatar sx={{ width: "120px", height: "120px" }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </Avatar>
                ) : (
                  <Avatar sx={{ width: "120px", height: "120px" }}>
                    <Typography variant="h4">+</Typography>
                  </Avatar>
                )}
              </IconButton>
            </label>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <TextField
            fullWidth
            label={"Name of plugin"}
            value={name}
            onChange={handleNameChange}
            inputProps={{ maxLength: 50 }}
            required
          />
          <Typography variant="caption" align="right">
            {charCount}/50
          </Typography>
        </Grid>
        <Grid item size={6}>
          <FormControl fullWidth required>
            <InputLabel id="category">Category</InputLabel>
            <Select
              fullWidth
              labelId="Category"
              id="category"
              value={category}
              label={"Category"}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value={"Module"}>Module</MenuItem>
              <MenuItem value={"NTU"}>NTU</MenuItem>
              <MenuItem value={"Career"}>Career</MenuItem>
              <MenuItem value={"General"}>General</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label={"Description"}
            value={description}
            multiline={true}
            rows={4}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PluginDetailsForm;
