import { Box, Typography, Button } from "@mui/material";
import { Grid } from "@mui/system";
// import { tokens } from "../../theme";
import { useState } from "react";
import DeactivateModal from "../modal/DeactivateModal";

const PluginRowAdmin = ({
  title,
  author,
  version,
  size,
  category,
  action,
  displayPic,
}) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
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
        <Grid
          item
          size={4}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Box
            component="img"
            src={displayPic}
            width={40}
            height={40}
            borderRadius="50%"
            mr={1}
          />
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
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none", fontSize: "13px", borderRadius: 2 }}
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

export default PluginRowAdmin;
