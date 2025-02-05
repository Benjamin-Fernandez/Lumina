import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  ButtonBase,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
// import { Link } from "react-router-dom";
import { Grid, Stack, useTheme } from "@mui/system";
import { tokens } from "../../../theme.js";
import ContributorRow from "../../../components/contributor/ContributorRow.jsx";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import contributorData from "../../../data/contributorData.jsx";
import axios from "../../../config/axiosConfig.js";
import Loading from "../../global/Loading.jsx";
import { toast, ToastContainer } from "react-toastify";

const Contributor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(8); // Rows per page
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const successToastify = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
    });
  };

  const errorToastify = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
    });
  };

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

  // Handle base click
  const handleBaseClick = (event) => {
    if (event.target.tagName === "BUTTON") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/user");
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and paginate data
  const filteredData = users.filter(
    (contributor) =>
      contributor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterTerm === "" || contributor.domain === filterTerm)
  );
  const paginatedData = filteredData
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handlePromote = async (id, name, email) => {
    try {
      const body = {
        name: name,
        email: email,
        domain: "Admin",
      };
      const response = await axios
        .put(`/user/${id}`, body)
        .then(successToastify("User promoted successfully"));
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  };

  const handleDemote = async (id, name, email) => {
    try {
      const body = {
        name: name,
        email: email,
        domain: "Developer",
      };
      const response = await axios
        .put(`/user/${id}`, body)
        .then(successToastify("User demoted successfully"));
      fetchUsers();
    } catch (error) {
      console.error("Error demoting user:", error);
    }
  };

  return (
    <>
      {loading ? (
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
          <Loading />
        </Box>
      ) : (
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
          <ToastContainer />
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
                <optgroup label="Domain">
                  <option value="Developer">Developer</option>
                  <option value="Admin">Admin</option>
                  {/* <option value="text">Text</option>
                <option value="utility">Utility</option> */}
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
                <Typography variant="body1">Name</Typography>
              </Grid>
              <Grid item size={3} mt={3}>
                <Typography variant="body1">Email</Typography>
              </Grid>
              <Grid item size={2} mt={3}>
                <Typography variant="body1">Domain</Typography>
              </Grid>
              <Grid item size={2} mt={3}>
                <Typography variant="body1">Joined</Typography>
              </Grid>
              <Grid item size={2} mt={3}>
                <Typography variant="body1">Action</Typography>
              </Grid>
            </Grid>
            {paginatedData.length === 0 ? (
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                mt={4}
              >
                No contributors found.
              </Typography>
            ) : (
              paginatedData.map((contributor, index) => (
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
                    email={contributor.email}
                    joined={contributor.createdAt}
                    handlePromote={() =>
                      handlePromote(
                        contributor._id,
                        contributor.name,
                        contributor.email
                      )
                    }
                    handleDemote={() =>
                      handleDemote(
                        contributor._id,
                        contributor.name,
                        contributor.email
                      )
                    }
                  />
                </ButtonBase>
              ))
            )}
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
      )}
      )
    </>
  );
};

export default Contributor;
