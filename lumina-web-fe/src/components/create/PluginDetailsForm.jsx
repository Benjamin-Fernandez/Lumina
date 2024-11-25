import React from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
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
  file,
  name,
  category,
  description,
  setFile,
  setName,
  setCategory,
  setDescription,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4">Enter Plugin Details 📝</Typography>
      <Typography variant="body1">
        Plugin details lets students learn more about your chatbot in Lumina
        Store! Fill in the details below to make your chatbot stand out and help
        students discover its value:
      </Typography>
      <Box>
        <FilePond
          files={file}
          onupdatefiles={(fileItems) =>
            setFile(fileItems.map((fileItem) => fileItem.file))
          }
          acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]} // File type validation for upload
          allowMultiple={false} // Allow only 1 file
          allowImageCrop={true} // Allow cropping
          allowImagePreview={true} // Preview images
          imageCropAspectRatio="1:1" // Crop to square
          name="profilePicture"
          labelIdle="+"
          stylePanelAspectRatio="1:1"
          stylePanelLayout="compact circle"
          styleButtonRemoveItemPosition="center bottom"
        />
        <style>
          {`
              /* Make the image uploader smaller */
              .filepond--root {
              justify-self: center;
              height: 120px; /* Set the height of the entire uploader */
              width: 120px; /* Set the width of the entire uploader */
                max-width: 120px; /* Set the width of the entire uploader */
                max-height: 120px; /* Set the height of the entire uploader */
              }

            `}
        </style>
      </Box>
      <Grid container spacing={2} mb="15px">
        <Grid item size={6}>
          <TextField
            fullWidth
            label={"Name of plugin"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
