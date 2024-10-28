import { Box } from "@mui/material";
import { useTheme } from "@mui/system";
import { tokens } from "../../theme";

import ContributorTable from "../../components/contributor/ContributorTable";

const Contributor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return <ContributorTable />;
};

export default Contributor;
