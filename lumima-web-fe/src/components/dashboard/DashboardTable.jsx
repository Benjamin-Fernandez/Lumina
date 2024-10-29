import { Box, Divider, Typography } from "@mui/material";
import { Grid, useTheme } from "@mui/system";
import { tokens } from "../../theme";
import DashboardRow from "./DashboardRow";

const DashboardTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      py={4}
      px={4}
      my={4}
      height="100%"
      width="100%"
      border={1}
      borderRadius={2}
      borderColor={colors.grey[800]}
    >
      <Typography variant="h4" fontWeight="bold">
        Plugins Overview
      </Typography>
      <Grid container spacing={2} mb="15px">
        {/* Table headers */}
        <Grid item size={4} mt={3}>
          <Typography variant="body1">Plugin Title</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Author</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Version</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Size</Typography>
        </Grid>
        <Grid item size={2} mt={3}>
          <Typography variant="body1">Status</Typography>
        </Grid>
      </Grid>
      {/* Table data */}
      <DashboardRow
        title="Career Advisor"
        author="EMIL0293"
        version="1.3.0"
        size="4.3MB"
        status="Approved"
        displayPic={"/assets/chatbotLogos/CareerAdvisor.png"}
      />
      <DashboardRow
        title="Course Recommender"
        author="WOOH2030"
        version="2.6.3"
        size="39.1MB"
        status="Approved"
        displayPic={"/assets/chatbotLogos/CourseRecommender.png"}
      />
      <DashboardRow
        title="FYP Chatbot"
        author="TANY0526"
        version="3.8.1"
        size="9.6MB"
        status="Approved"
        displayPic={"/assets/chatbotLogos/FYPChatbot.png"}
      />
      <DashboardRow
        title="MacOS Helper"
        author="NIKI1039"
        version="1.2.4"
        size="3.1MB"
        status="Approved"
        displayPic={"/assets/chatbotLogos/MacOSHelper.png"}
      />
      <DashboardRow
        title="SC1015 Chatbot"
        author="OWIE0200"
        version="1.4.5"
        size="8.3MB"
        status="Approved"
        displayPic={"/assets/chatbotLogos/SC1015Chatbot.png"}
      />
      <DashboardRow
        title="SC2040 Chatbot"
        author="NATI0009"
        version="3.9.5"
        size="1.0MB"
        status="Approved"
        displayPic={"/assets/chatbotLogos/SC2040Chatbot.png"}
      />
      <DashboardRow
        title="Timetable Planner"
        author="TEYL0029"
        version="2.9.8"
        size="80.1MB"
        status="Approved"
        displayPic={"/assets/chatbotLogos/TimetablePlanner.png"}
      />
    </Box>
  );
};

export default DashboardTable;
