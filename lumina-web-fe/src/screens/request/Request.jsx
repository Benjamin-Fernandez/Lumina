import {
  Box,
  Divider,
  Typography,
  TextField,
  InputAdornment,
  Button,
  TablePagination,
  ButtonBase,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Grid, Stack, useTheme } from "@mui/system";
import { tokens } from "../../theme.js";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import requestData from "../../data/requestData.jsx";
import RequestRow from "../../components/request/RequestRow.jsx";

const Request = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
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

  const handleFilterChange = (event) => {
    setFilterTerm(event.target.value);
  };

  const handleBaseClick = (event) => {
    if (event.target.tagName === "BUTTON") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Filter and paginate data
  const filteredData = requestData.filter(
    (request) =>
      (request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterTerm === "" || request.category === filterTerm)
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
        <FormControl>
          <InputLabel htmlFor="category">Filter</InputLabel>
          <Select
            native
            defaultValue=""
            id="filter-button"
            label="Filter"
            sx={{
              width: "100%",
              textTransform: "none",
              fontSize: "13px",
            }}
            onChange={handleFilterChange}
          >
            <option aria-label="None" value="" />
            <optgroup label="Category">
              <option value="Planning">Planning</option>
              <option value="Help">Help</option>
              <option value="Modules">Modules</option>
              {/* <option value="text">Text</option>
                <option value="utility">Utility</option> */}
            </optgroup>
            <optgroup label="Request Type">
              <option value="Deployment">Deployment</option>
              <option value="Update">Update</option>
            </optgroup>
          </Select>
        </FormControl>
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
          <Grid item size={3} mt={3}>
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
          <Grid item size={3} mt={3}>
            <Typography variant="body1">Action</Typography>
          </Grid>
        </Grid>

        {/* Table data */}
        {paginatedData.map((request, index) => (
          <Link
            to={`/request/${request.id}`}
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
              <RequestRow
                key={index}
                title={request.title}
                author={request.author}
                version={request.version}
                size={request.size}
                category={request.category}
                status={request.status}
                action={request.action}
                displayPic={request.displayPic}
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

export default Request;
