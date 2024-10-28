import { Box } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";
import StatsCard from "../../components/dashboard/StatsCard";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PluginTable from "../../components/plugin/PluginTable";

const Plugin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return <PluginTable />;
};

export default Plugin;
