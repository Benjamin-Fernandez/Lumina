import {
  Box,
  Divider,
  Typography,
  TextField,
  InputAdornment,
  Button,
  TablePagination,
  ButtonBase,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Grid, Stack, useTheme } from "@mui/system";
import { tokens } from "../../theme.js";
import PluginRow from "../../components/plugin/PluginRow.jsx";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import pluginData from "../../data/pluginData.jsx";

const Plugin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(8); // Rows per page

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Handle search term
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBaseClick = (event) => {
    if (event.target.tagName === "BUTTON") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Filter and paginate data
  const filteredData = pluginData.filter(
    (plugin) =>
      plugin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignContent="center"
      >
        <TextField
          id="search-bar"
          variant="outlined"
          placeholder="Search"
          onChange={handleSearchChange}
          value={searchTerm}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "90%",
          }}
        />
        <Button
          variant="contained"
          startIcon={<TuneIcon />}
          sx={{
            width: "10%",
            padding: "15px",
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.yellowAccent[500],
          }}
        >
          Filter
        </Button>
      </Stack>
      <Box
        sx={{
          height: "80%", // Set the height of the box
          overflowY: "auto", // Enable vertical scroll when content overflows
          overflowX: "hidden", // Hide horizontal scroll
          mt: 2,
        }}
      >
        <Grid container spacing={2} mb="15px">
          {/* Table headers */}
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Plugin Title</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Author</Typography>
          </Grid>
          <Grid item size={1} mt={3}>
            <Typography variant="body1">Version</Typography>
          </Grid>
          <Grid item size={1} mt={3}>
            <Typography variant="body1">Size</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Category</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Status</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Action</Typography>
          </Grid>
        </Grid>

        {/* Table data */}
        {paginatedData.map((plugin, index) => (
          <Link
            to={`/plugin/${plugin.id}`}
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ButtonBase
              key={index}
              onClick={handleBaseClick}
              sx={{
                width: "100%",
                display: "block",
                textAlign: "left",
                borderTop: "1px solid",
                borderColor: colors.grey[900],
                paddingY: "15px",
              }}
            >
              <PluginRow
                key={index}
                title={plugin.title}
                author={plugin.author}
                version={plugin.version}
                size={plugin.size}
                category={plugin.category}
                status={plugin.status}
                action={plugin.action}
              />
            </ButtonBase>
          </Link>
        ))}
      </Box>

      {/* Pagination component */}
      <TablePagination
        component="div"
        count={filteredData.length} // Total number of rows
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page"
        sx={{ mt: 3 }}
      />
    </Box>
  );
};

export default Plugin;
