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

const TechnicalAnalystTab = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizedQuery, setOptimizedQuery] = useState("");
  const [data, setData] = useState([]);

  const handleExecuteQuery = () => {
    setLoading(true);
    setTimeout(() => {
      setOptimizedQuery(query.replace("*", "sales, revenue"));
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

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", p: 3, backgroundColor: "#f4f6f8" }}>
      <TextField
        fullWidth
        label="Enter SQL Query"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleExecuteQuery} sx={{ mb: 2 }}>
        Execute Query
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      
      {optimizedQuery && (
        <Paper sx={{ mt: 3, p: 2, width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>Optimized Query:</Typography>
          <Typography variant="body2" fontFamily="monospace">{optimizedQuery}</Typography>
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
      )}
    </Box>
  );
};

export default TechnicalAnalystTab;
