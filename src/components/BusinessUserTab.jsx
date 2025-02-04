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
} from "@mui/material";

const BusinessUserTab = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState("");
  const [inference, setInference] = useState("");
  const [nextPrompts, setNextPrompts] = useState([]);

  const handleFetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setQuery(`SELECT sales, region FROM sales_data WHERE quarter = 'Q1 2024' LIMIT 5`);
      setData([
        { region: "North", sales: "$120,000" },
        { region: "South", sales: "$98,000" },
        { region: "East", sales: "$110,000" },
        { region: "West", sales: "$105,000" },
        { region: "Central", sales: "$102,000" },
      ]);
      setInsights("North region had the highest sales in Q1 2024.");
      setInference("Sales performance is strong in the North, and marketing efforts may need to focus on the South.");
      setNextPrompts([
        "What are the sales for Q2 2024?",
        "Compare Q1 2024 sales with Q1 2023.",
        "Show sales trends for 2024.",
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", p: 3, backgroundColor: "#f4f6f8" }}>
      <TextField
        fullWidth
        label="Enter your prompt"
        variant="outlined"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
      />
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
        <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}>
          <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "#1976d2" }}>Retrieved Data:</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Sales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.region}</TableCell>
                  <TableCell>{row.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Grid container spacing={2} sx={{ mt: 2, width: "100%" }}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#388e3c" }}>Insights:</Typography>
            <Typography>{insights}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d32f2f" }}>Inference:</Typography>
            <Typography>{inference}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {nextPrompts.length > 0 && (
        <Paper sx={{ mt: 2, p: 2, width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff9800" }}>Suggested Next Prompts:</Typography>
          {nextPrompts.map((p, index) => (
            <Typography key={index}>- {p}</Typography>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default BusinessUserTab;
