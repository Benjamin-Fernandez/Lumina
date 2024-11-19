import { Box, ButtonBase } from "@mui/material";
import { useTheme } from "@mui/system";
import { Link } from "react-router-dom";

import { tokens } from "../../../theme";
import StatsCard from "../../../components/dashboard/StatsCard";
import DashboardTable from "../../../components/dashboard/DashboardTable";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handlePlugin = () => {};
  const handleRequest = () => {};
  return (
    <Box px={4}>
      <Box
        width="50%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        gap={4}
      >
        <Link
          to={`/plugin`}
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <ButtonBase
            onClick={handlePlugin}
            sx={{
              width: "100%",
              display: "block",
              textAlign: "left",
            }}
          >
            <StatsCard
              icon={
                <ExtensionOutlinedIcon
                  style={{
                    height: "30px",
                    width: "30px",
                    color: colors.blueAccent[500],
                  }}
                />
              }
              title="Deployed Plugins"
              value="548"
            />
          </ButtonBase>
        </Link>
        <Link
          to={`/request`}
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <ButtonBase
            onClick={handleRequest}
            sx={{
              width: "100%",
              display: "block",
              textAlign: "left",
            }}
          >
            <StatsCard
              icon={
                <ConfirmationNumberOutlinedIcon
                  style={{
                    height: "30px",
                    width: "30px",
                    color: colors.blueAccent[500],
                  }}
                />
              }
              title="Approval Requests"
              value="23"
            />
          </ButtonBase>
        </Link>
      </Box>
      <DashboardTable />
    </Box>
  );
};

export default Dashboard;
