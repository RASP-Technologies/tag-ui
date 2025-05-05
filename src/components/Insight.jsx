import React, { useState, useRef } from "react";
import {
  TextField,
  Divider,
  Button,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";

const BusinessUserTab = () => {
  const [prompt, setPrompt] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [optimizedQuery, setOptimizedQuery] = useState("");
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [executionData, setExecutionData] = useState(null);
  const [dryRunLoading, setDryRunLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPrompts, setErrorPrompts] = useState([]);
  const [selectedDataCategory, setSelectedDataCategory] = useState("Market Data");
  const [selectedDataSubCategory, setSelectedDataSubCategory] = useState("Payments");
  const [insightLoading, setInsightLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);

  const textFieldRef = useRef(null);

  // Estimated Cost Button Handler
  const handleDryRun = async (sqlQuery) => {
    setDryRunLoading(true);
    setExecutionData(null);

    try {
      const response = await fetch("http://localhost:8082/api/cost/estimate", {
        // Using proxy (see below)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: sqlQuery,
        }),
      });

      if (!response.ok) {
        throw new Error(`Dry run failed with status ${response.status}`);
      }

      const result = await response.json();
      setExecutionData(result);
    } catch (error) {
      console.error("Error during dry run:", error);
      setExecutionData(null);
    } finally {
      setDryRunLoading(false);
    }
  };

  const handleInsightData = async () => {
    setResultsLoading(true);
    setInsightLoading(true);
    try {
      const response = await fetch("http://localhost:8082/generate_insights_from_query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: optimizedQuery,  // ✅ Use optimizedQuery from text box
          llm_type: "openai"
        })
      });

      console.log("Sending optimized query:", optimizedQuery); // ✅ Log optimized query

      const apiData = await response.json();
      if (!response.ok) throw new Error("Insight API failed");

      setData(apiData.result || []);
      setInsights(apiData.textual_summary || []);
    } catch (err) {
      console.error("Insight error:", err);
    } finally {
      setResultsLoading(false);
      setInsightLoading(false);
    }
  };
  // Generate Optimized Query
  const handleOptimizeData = async () => {
    setQuery("");
    setOptimizedQuery("");
    setData([]);
    setInsights([]);
    setExecutionData(null);

    setGenerateLoading(true);

    try {
      const response = await fetch("http://localhost:8082/optimise_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: prompt,
          llm_type: "openai",
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const apiData = await response.json();
      setOptimizedQuery(apiData.sql_query_generated || "No query generated.");
    } catch (error) {
      console.error("Error fetching insights:", error);
      setOptimizedQuery("Error generating query.");
    } finally {
      setGenerateLoading(false);
    }
  };

  // Pagination Logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const displayRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
      <Container maxWidth={false} disableGutters sx={{ width: "99vw", margin: 0, padding: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <CssBaseline />
        <Box sx={{ mt: 2, mb: 0, width: "100%", alignItems: "flex-start" }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Prompt Input */}
            <Grid item xs={12} sm={7} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <TextField
                  inputRef={textFieldRef}
                  autoFocus
                  fullWidth
                  label="How can I help you?"
                  variant="outlined"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  sx={{ backgroundColor: "white" }}
              />
            </Grid>

            {/* Domain/Category Controls */}
            <Grid item xs={12} sm={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <FormControl size="small" sx={{ m: 1, width: "250px" }}>
                <InputLabel id="data-category-select-label">Domain</InputLabel>
                <Select
                    labelId="data-category-select-label"
                    id="data-category-select"
                    value={selectedDataCategory}
                    label="Domain"
                    onChange={(e) => setSelectedDataCategory(e.target.value)}
                >
                  <MenuItem value="Market Data">Market Data</MenuItem>
                  <MenuItem value="Finance Data">Finance Data</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ m: 1, width: "250px" }}>
                <InputLabel id="data-sub-category-select-label">Sub-Domain</InputLabel>
                <Select
                    labelId="data-sub-category-select-label"
                    id="data-sub-category-select"
                    value={selectedDataSubCategory}
                    label="Sub-Domain"
                    onChange={(e) => setSelectedDataSubCategory(e.target.value)}
                >
                  <MenuItem value="Payments">Payments</MenuItem>
                  <MenuItem value="Cyber">Cyber</MenuItem>
                  <MenuItem value="Cards">Cards</MenuItem>
                  <MenuItem value="Frauds">Frauds</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Generate Button */}
            <Grid item xs={12} sm={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <LoadingButton
                  loading={generateLoading}
                  loadingPosition="start"
                  startIcon={<PlayArrowIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleOptimizeData}
                  sx={{ mb: 2, typography: "caption" }}
              >
                Generate
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>

        {/* Optimized Query Section */}
        {optimizedQuery && (
            <Grid container spacing={2} sx={{ mt: 1, padding: 1, border: "1px solid #ccc" }}>
              <Grid item xs={12} sm={11.8}>
                <Box sx={{ borderRadius: 1, boxShadow: 1, bgcolor: "background.paper" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1, borderBottom: 1, borderColor: "divider", backgroundColor: "#eaecec" }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Optimized Query
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton size="small">
                        <ContentCopyOutlinedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton size="small">
                        <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: "#defaec" }}>
                    <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        value={optimizedQuery}
                        onChange={(e) => setOptimizedQuery(e.target.value)}
                        sx={{ backgroundColor: "white" }}
                        InputProps={{
                          style: { fontFamily: "monospace", fontWeight: "bold" },
                        }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
        )}

        {/* Estimated Cost Button (Right-Aligned) */}
        {optimizedQuery && !generateLoading && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start", width: "100%" }}>
              {/* <Divider sx={{ my: 2, width: "95%" }} /> */}
              <LoadingButton
                  loading={dryRunLoading}
                  startIcon={<AccessTimeIcon />}
                  onClick={() => handleDryRun(optimizedQuery)}
                  variant="contained"
                  size="small"
                  color={dryRunLoading ? "secondary" : "primary"}
                  sx={{
                    fontSize: "0.80rem",
                    padding: "4px 10px",
                    minWidth: "90px",
                    textTransform: "none",
                    mt: 2,
                    mb: 3,
                  }}
              >
                Estimated Cost
              </LoadingButton>
            </Box>
        )}

        {/* Execution Cost Table */}
        {executionData && (
            <Box sx={{ display: "flex", justifyContent: "start", mt: 1, mb: 4 }}>
              <TableContainer component={Paper} sx={{ maxWidth: 900, overflowY: "hidden", boxShadow: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Estimated Cost</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Data Processed</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Base Cost</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Price Per TB</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{`$${executionData.estimated_cost_usd?.toFixed(6)}`}</TableCell>
                      <TableCell>{`${executionData.bytes_processed} bytes`}</TableCell>
                      <TableCell>{`$${executionData.base_cost_usd}`}</TableCell>
                      <TableCell>{`$${executionData.price_per_tb_usd}`}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>


        )}



        {/* Error Dialog */}
        <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
          <DialogTitle fontWeight="bold">Query Error</DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
            {errorPrompts.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Sample Analytical Prompts:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {errorPrompts.map((prompt, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">{prompt}</Typography>
                        </Box>
                    ))}
                  </Box>
                </>


            )}


          </DialogContent>
          <DialogActions>
            <Button onClick={() => setErrorDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Show Results Button - Bottom Right */}


        {/* Show Results Button - Bottom Right */}
        {optimizedQuery && !generateLoading && (
            <Box sx={{
              mt: 4,
              mb: -4,
              width: "100%",
              display: "flex",
              justifyContent: "flex-start" // Aligns button to the right
            }}>
              <LoadingButton
                  loading={insightLoading}
                  loadingPosition="start"
                  startIcon={<PlayArrowIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleInsightData}
                  sx={{
                    fontSize: "0.80rem",
                    padding: "4px 10px",
                    minWidth: "90px",
                    textTransform: "none",
                    mt: -3,
                    mb: 3,
                  }}
              >
                Show Results
              </LoadingButton>
            </Box>
        )}

        {data.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 4, maxWidth: '90vw' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(data[0]).map((key) => (
                        <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, idx) => (
                      <TableRow key={idx}>
                        {Object.values(row).map((val, i) => (
                            <TableCell key={i}>{val}</TableCell>
                        ))}
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        )}

      </Container>
  );
};

export default BusinessUserTab;