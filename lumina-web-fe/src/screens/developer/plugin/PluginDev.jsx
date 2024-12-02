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
import { Link } from "react-router-dom";
import { Grid, Stack, useTheme } from "@mui/system";
import { tokens } from "../../../theme.js";
import PluginRowDev from "../../../components/plugin/PluginRowDev.jsx";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../../config/axiosConfig.js";
import { useMsal } from "@azure/msal-react";
import Loading from "../../global/Loading.jsx";

const PluginDev = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(8); // Rows per page
  const [plugin, setPlugin] = useState([]);
  const [loading, setLoading] = useState(true);
  const { instance } = useMsal();
  const email = instance.getActiveAccount()?.username;

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

  // Handle filter term
  const handleFilterChange = (event) => {
    setFilterTerm(event.target.value);
  };

  const handleBaseClick = (event) => {
    if (event.target.tagName === "BUTTON") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const fetchPlugin = async () => {
    try {
      console.log("User email obtained from context " + email);
      const response = await axios.get("/plugin/email/" + email);
      setPlugin(response.data.plugin);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plugin data:", error);
    }
  };

  useEffect(() => {
    // Fetch plugin data from the database
    fetchPlugin();
  }, []);

  useEffect(() => {
    console.log("Plugin data fetched from the database: ", plugin);
  }, [plugin]);

  // Filter and paginate data
  const filteredData = plugin.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterTerm === "" || request.category === filterTerm) &&
      (filterTerm === "" || request.activated === (filterTerm === "true"))
  );
  const paginatedData = filteredData
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
                  <option value="Module">Module</option>
                  <option value="NTU">NTU</option>
                  <option value="Career">Career</option>
                  <option value="General">General</option>
                </optgroup>
                <optgroup label="Status">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
            {paginatedData.length === 0 ? (
              // Render "No plugins" message when no data
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                mt={4}
              >
                You don’t have any plugins.
              </Typography>
            ) : (
              <>
                <Grid container spacing={2} mb="15px">
                  {/* Table headers */}
                  <Grid item size={4} mt={3}>
                    <Typography variant="body1">Plugin Title</Typography>
                  </Grid>

                  <Grid item size={2} mt={3}>
                    <Typography variant="body1">Version</Typography>
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
                    to={`/pluginDev/${plugin._id}`}
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
                      <PluginRowDev
                        key={index}
                        name={plugin.name}
                        userName={plugin.userName}
                        version={plugin.version}
                        category={plugin.category}
                        activated={plugin.activated}
                        image={plugin.image}
                      />
                    </ButtonBase>
                  </Link>
                ))}
              </>
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
    </>
  );
};

export default PluginDev;
