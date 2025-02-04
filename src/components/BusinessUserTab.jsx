import React, { useState } from "react";
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
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const BusinessUserTab = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState("");
  const [inference, setInference] = useState("");
  const [nextPrompts, setNextPrompts] = useState([]);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightTimeout, setInsightTimeout] = useState(null);

  const handleFetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setQuery(`SELECT c.CustomerName, lt.Amount, b.BankName FROM LoanTransaction lt JOIN customer c ON lt.CustomerID = c.CustomerID JOIN banks b ON lt.BankID = b.BankID WHERE lt.Type = 'Loan' AND b.BankName = 'China Development Bank'`);
      setData([
        { customerName: "Auto Parts Corp", loanAmount: "$300,000", bank: "China Development Bank" },
      ]);
      setLoading(false);
    }, 2000);
  };

    const handleInsightData = () => {
      setInsightLoading(true);
      setTimeout(() => {
        setInsights("The total loan given my China Development Bank is $300,000");
        setNextPrompts([
                "How much loan has India National Bank given to it's customer?",
                "Compare Q1 2024 sales with Q1 2023.",
                "Show sales trends for 2024.",
              ]);
        setInsightLoading(false);
      }, 2000);
    };

  return (
   <Container maxWidth="xl" sx={{ width: '100vw', height: '130vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Center the content */}
     <CssBaseline />
       <AppBar position="static">
         <Toolbar>
           <IconButton edge="start" color="inherit" aria-label="menu">
             <MenuIcon />
           </IconButton>
           <Typography variant="h6" style={{ flexGrow: 1 }}>
             Data Insights
           </Typography>
         </Toolbar>
       </AppBar>

      <Box sx={{ mt: 2, mb: 2, width: '100%',  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Enter your prompt"
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          />
      </Box>
      <Button variant="contained" color="primary" onClick={handleFetchData} sx={{ mb: 2 }}>
        Fetch Data
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      
      {query && (
        <Paper sx={{ mt: 3, p: 2, width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>Executed Query:</Typography>
          <Typography variant="body2" fontFamily="monospace">{query}</Typography>
        </Paper>
      )}

      {data.length > 0 && (
        <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column' }}
        >
        <TableContainer component={Paper} sx={{ mt: 2, mb: 2, width: "100%" }}>
          <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "#1976d2" }}>Retrieved Data:</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Loan Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Bank Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.loanAmount}</TableCell>
                  <TableCell>{row.bank}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      )}

    {data.length > 0 && (
        <Button variant="contained" color="primary" onClick={handleInsightData} sx={{ mb: 2 }}>
          Get Insights
        </Button>
      )}

    { insightLoading && <CircularProgress sx={{ mt: 2 }} />}

    { insights && (
      <Paper sx={{ mt: 2, p: 2, width: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#388e3c" }}>Insights:</Typography>
        <Typography>{insights}</Typography>
      </Paper>
      )}

      {nextPrompts.length > 0 && (
        <Paper sx={{ mt: 2, p: 2, width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff9800" }}>Suggested Next Prompts:</Typography>
          {nextPrompts.map((p, index) => (
            <Typography key={index}>- {p}</Typography>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default BusinessUserTab;
