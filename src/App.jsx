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
    <Container maxWidth="xl" sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2", boxShadow: "none" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{ "& .MuiTab-root": { color: "white", fontWeight: "bold", textTransform: "none" }, "& .Mui-selected": { color: "#ffeb3b" } }}
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