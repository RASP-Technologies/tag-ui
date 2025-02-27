import React, { useState } from "react";
import { Container, AppBar, Tabs, Tab, Box, Typography } from "@mui/material";
import Insight from "./components/Insight";
import Optimize from "./components/Optimize";
import Recommendation from "./components/Recommendation";

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ width: "99vw", margin: 0, padding: 0,  minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#FF000", boxShadow: "none" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          sx={{ "& .MuiTab-root": { fontSize: '1.2rem', color: "white", fontWeight: "bold", fontFamily: 'sans-serif', textTransform: "none" , alignItems: "left"}
          ,"& .MuiTabs-flexContainer": { justifyContent: 'flex-start'}
          }}
        >ˀ
          <Tab label="Insight" />
          <Tab label="Optimize" />
          <Tab label="Recommendation" />
        </Tabs>
      </AppBar>

      <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {tabIndex === 0 && <Insight />}
        {tabIndex === 1 && <Optimize />}
        {tabIndex === 2 && <Recommendation />}
      </Box>
    </Container>
  );
};

export default App;