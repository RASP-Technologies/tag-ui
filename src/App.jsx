import React, { useState } from "react";
import { Container, AppBar, Tabs, Tab, Box, Typography } from "@mui/material";
import BusinessUserTab from "./components/BusinessUserTab";
import TechnicalAnalystTab from "./components/TechnicalAnalystTab";
import BigQueryOptimizationTab from "./components/BigQueryOptimizationTab";

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ width: "99vw", margin: 0, padding: 0, backgroundColor: "#f4f6f8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#1976d2", boxShadow: "none" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          sx={{ "& .MuiTab-root": { fontSize: '1.2rem', color: "white", fontWeight: "bold", textTransform: "none" , alignItems: "left"}
          ,"& .MuiTabs-flexContainer": { justifyContent: 'flex-start'}
          }}
        >
          <Tab label="Business User" />
          <Tab label="Technical Analyst" />
          <Tab label="BigQuery Optimization" />
        </Tabs>
      </AppBar>

      <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {tabIndex === 0 && <BusinessUserTab />}
        {tabIndex === 1 && <TechnicalAnalystTab />}
        {tabIndex === 2 && <BigQueryOptimizationTab />}
      </Box>
    </Container>
  );
};

export default App;