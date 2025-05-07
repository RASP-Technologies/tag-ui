import React, { useState } from "react";
import { Container, AppBar, Tabs, Tab, Box } from "@mui/material";
import Insight from "./components/Insight";
import Optimize from "./components/Optimize";
import Recommendation from "./components/Recommendation";
import logo from "./assets/hsbc-logo.png"; // Ensure your logo image is in this path

const App = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                width: "99vw",
                margin: 0,
                padding: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AppBar
                position="static"
                sx={{
                    width: "100%",
                    backgroundColor: "#db0011",
                    boxShadow: "none",
                }}
            >
                {/* Flex container for Tabs and Logo */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 2,
                    }}
                >
                    {/* Tabs aligned left */}
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        textColor="inherit"
                        indicatorColor="white"
                        aria-label="tabs"
                        sx={{
                            "& .MuiTab-root": {
                                fontSize: "1.2rem",
                                color: "#fffff",
                                fontWeight: "bold",
                                fontFamily: "sans-serif",
                                textTransform: "none",
                            },
                        }}
                    >
                        <Tab label="Generate Query" />
                        <Tab label="Optimize" />
                        <Tab label="Recommendation" />
                    </Tabs>

                    {/* Logo aligned right */}
                    <Box component="img" src={logo} alt="Logo" sx={{ height: 40 }} />
                </Box>
            </AppBar>

            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    display: "flex",
                    backgroundColor: '#f5f5f5',
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {tabIndex === 0 && <Insight />}
                {tabIndex === 1 && <Optimize />}
                {tabIndex === 2 && <Recommendation />}
            </Box>
        </Container>
    );
};

export default App;
