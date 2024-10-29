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
import ContributorRow from "../../components/contributor/ContributorRow.jsx";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import contributorData from "../../data/contributorData.jsx";

const Contributor = () => {
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

  // Handle base click
  const handleBaseClick = (event) => {
    if (event.target.tagName === "BUTTON") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Filter and paginate data
  const filteredData = contributorData.filter((contributor) =>
    contributor.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            width: "70%",
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            width: "20%",
            padding: "15px",
            textTransform: "none",
            fontSize: "13px",
            bgcolor: colors.blueAccent[400],
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          component={Link}
          to="/contributorform" // Navigate to the new link
        >
          Add new contributor
        </Button>
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
          <Grid item size={4} mt={3}>
            <Typography variant="body1">Name</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Domain</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Last Online</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Joined</Typography>
          </Grid>
          <Grid item size={2} mt={3}>
            <Typography variant="body1">Action</Typography>
          </Grid>
        </Grid>

        {/* Table data */}
        {paginatedData.map((contributor, index) => (
          <Link
            to={`/contributor/${contributor.id}`}
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
              <ContributorRow
                name={contributor.name}
                domain={contributor.domain}
                lastOnline={contributor.lastOnline}
                joined={contributor.joined}
                action={contributor.action}
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

export default Contributor;
