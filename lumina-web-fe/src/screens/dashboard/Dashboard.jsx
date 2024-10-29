import { Box } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";
import StatsCard from "../../components/dashboard/StatsCard";
import DashboardTable from "../../components/dashboard/DashboardTable";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box px={4}>
      <Box
        width="50%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        gap={4}
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
          title="Total Plugins"
          value="548"
        />

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
      </Box>
      <DashboardTable />
    </Box>
  );
};

export default Dashboard;
