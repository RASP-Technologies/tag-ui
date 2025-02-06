import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Link,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const TechnicalAnalystTab = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizedQuery, setOptimizedQuery] = useState("");
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState("");
  const [nextPrompts, setNextPrompts] = useState([]);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightTimeout, setInsightTimeout] = useState(null);
  const textFieldRef = useRef(null);

  const handleExecuteQuery = () => {
    setLoading(true);
    setTimeout(() => {
      setOptimizedQuery(prompt.replace("*", "sales, revenue"));
      setData([
        { region: "North", sales: "$120,000", revenue: "$60,000" },
        { region: "South", sales: "$98,000", revenue: "$50,000" },
        { region: "East", sales: "$110,000", revenue: "$55,000" },
        { region: "West", sales: "$105,000", revenue: "$53,000" },
        { region: "Central", sales: "$102,000", revenue: "$51,000" },
      ]);
      setLoading(false);
    }, 2000);
  };

  const handleInsightData = () => {
    setInsightLoading(true);
    setTimeout(() => {
      setInsights("North region had the highest sales in Q1 2024.");
      setNextPrompts([
              "What are the sales for Q2 2024?",
              "Compare Q1 2024 sales with Q1 2023.",
              "Show sales trends for 2024.",
            ]);
      setInsightLoading(false);
    }, 2000);
  };



    const handleLinkClick = (text) => {
    // Populate the TextField with the clicked link
    setPrompt(text);
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();

        // Select all text in the TextField
        textFieldRef.current.select();
      }
    }, 100);
    };

  return (
    <Container maxWidth={false} disableGutters sx={{ width: "99vw", margin: 0, padding: 0, backgroundColor: "#f4f6f8", minHeight: "100vh", display: "flex", flexDirection: "column" }}> {/* Center the content */}
     <CssBaseline />
      <Box sx={{ mt: 2, mb: 2, width: '100%',  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={11}>
                  <TextField
                    inputRef={textFieldRef}
                    autoFocus
                    fullWidth
                    label="Want to optimize your query ?"
                    variant="outlined"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
                  />
             </Grid>
             <Grid item xs={12} sm={1}
                     sx={{
                           display: 'flex',
                           justifyContent: 'center',
                           alignItems: 'center',
                           textAlign: 'center'
                         }}>
                     <Button variant="contained" color="primary" onClick={handleExecuteQuery} sx={{ mb: 2 , alignItems: 'center',typography: 'caption'}}>
                             EXECUTE
                   </Button>
             </Grid>
         </Grid>
      </Box>


      {loading && <CircularProgress sx={{ mt: 2 }} />}
      
      {optimizedQuery && (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={5} sx={{ alignSelf: 'flex-start' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ mt: 3, mb: 2, p: 2, width: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>Optimized Query:</Typography>
              <Typography variant="body2" fontFamily="monospace">{optimizedQuery}</Typography>
            </Paper>
            </Box>
          {data.length > 0 && (
              <Button variant="contained" color="primary" onClick={handleInsightData} sx={{ mb: 2 }}>
                Get Insights
              </Button>
            )}
        </Grid>

        <Grid item xs={12} sm={7} sx={{ alignSelf: 'flex-start' }}>
            {data.length > 0 && (
                    <Box sx={{ height: '450px', // Fixed container height
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column' }}
                    >
                    <TableContainer component={Paper} sx={{ mt: 2, mb : 2, width: "100%", maxHeight: 440, overflow: 'auto', table: { tableLayout: 'fixed' }}}>
                      <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "#1976d2" }}>Retrieved Data:</Typography>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Sales</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Revenue</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.region}</TableCell>
                              <TableCell>{row.sales}</TableCell>
                              <TableCell>{row.revenue}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    </Box>
                  )}
            </Grid>
        </Grid>
      )}





      {insightLoading && <CircularProgress sx={{ mt: 2 }} />}

      {insights && (
        <Paper sx={{ mt: 2, p: 2, width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#388e3c" }}>Insights:</Typography>
          <Typography>{insights}</Typography>
        </Paper>
        )}

        {nextPrompts.length > 0 && (
          <Paper sx={{ mt: 2, p: 2, width: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff9800" }}>Suggested Next Prompts:</Typography>
            {nextPrompts.map((p, index) => (
              <Typography key={index}>
                  <Link
                    component="button"
                    color="primary"
                    underline="hover"
                    onClick={() => handleLinkClick(p)}
                    sx={{
                      typography: 'body1',

                      cursor: 'pointer'
                    }}
                  >
                  - {p}
                  </Link>
                  </Typography>
            ))}
          </Paper>
        )}
    </Container>
  );
};

export default TechnicalAnalystTab;
