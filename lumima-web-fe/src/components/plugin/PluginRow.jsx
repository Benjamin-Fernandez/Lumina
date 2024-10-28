import {
  Box,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Grid, textTransform, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import { useState } from "react";
import DeactivateModal from "../modal/DeactivateModal";

const PluginRow = ({
  title,
  author,
  version,
  size,
  category,
  status,
  action,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);

  const handleOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box justifyContent="center">
      <Grid container spacing={2} alignItems="center">
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {author}
          </Typography>
        </Grid>
        <Grid item size={1}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {version}
          </Typography>
        </Grid>
        <Grid item size={1}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {size}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Typography
            variant="body1"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {category}
          </Typography>
        </Grid>
        <Grid item size={2}>
          <Box>
            <Typography
              variant="body1"
              bgcolor={colors.blueAccent[900]}
              color={colors.blueAccent[300]}
              borderRadius={2}
              width="fit-content"
              p={1}
              noWrap
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {status}
            </Typography>
          </Box>
        </Grid>
        <Grid item size={2}>
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none", fontSize: "13px" }}
            onClick={handleOpen}
          >
            {action}
          </Button>
        </Grid>
      </Grid>
      <DeactivateModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default PluginRow;
