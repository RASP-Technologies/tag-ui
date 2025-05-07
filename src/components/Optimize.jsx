// Updated TechnicalAnalystTab component with prompt section aligned to top-left

import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
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
  Divider,
  IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

const TechnicalAnalystTab = () => {
  const [prompt, setPrompt] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [dryRunLoading, setDryRunLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [executionData, setExecutionData] = useState(null);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const textFieldRef = useRef(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPrompts, setErrorPrompts] = useState([]);

  const handleFetchData = async () => {
    setQuery("");
    setData([]);
    setInsights([]);
    setGenerateLoading(true);
    setShowResultsButton(false);

    try {
      const response = await fetch("http://localhost:8082/optimise_query_1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt, llm_type: "openai" })
      });

      const apiData = await response.json();

      if (response.status === 400) {
        setErrorMessage(apiData.textual_summary?.[0] || "An error occurred.");
        setErrorPrompts(apiData.followup_prompts || []);
        setErrorDialogOpen(true);
        return;
      }

      if (!response.ok) throw new Error("API failed");

      setQuery(apiData.sql_query_generated || apiData.textual_summary[0]);
      setShowResultsButton(true);

    } catch (err) {
      console.error("Error:", err);
      setQuery("Error generating query.");
      setShowResultsButton(false);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleDryRun = async (query) => {
    setDryRunLoading(true);
    try {
      const response = await fetch("http://localhost:8082/api/cost/estimate", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      if (!response.ok) throw new Error("Dry run failed");
      setExecutionData(result);
    } catch (err) {
      console.error("Dry run error:", err);
    } finally {
      setDryRunLoading(false);
    }
  };

  const handleInsightData = async () => {
    setResultsLoading(true);
    try {
      const response = await fetch("http://localhost:8082/generate_insights_from_query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, llm_type: "openai" })
      });
      const apiData = await response.json();
      if (!response.ok) throw new Error("Insight API failed");
      setData(apiData.result || []);
      setInsights(apiData.textual_summary || []);
    } catch (err) {
      console.error("Insight error:", err);
    } finally {
      setResultsLoading(false);
    }
  };

  return (
      <Container maxWidth={false} sx={{ padding: 5,paddingTop: 2 , backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column',  overflowY: 'auto' , width: '100vw'}}>
        <CssBaseline />
        <Box sx={{ pt: 2, px: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#f5f5f5'}}>
          <TableContainer component={Paper} sx={{ maxWidth: '90vw', mb: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#000000', height: '32px' }}>
                <TableRow sx={{ height: '32px' }}>
                  <TableCell colSpan={1} sx={{ padding: '8px 16px' }}>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontSize: '0.8rem' }}>
                      SQL Query Optimizer
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box>
                      <TextField
                          fullWidth
                          inputRef={textFieldRef}
                          label="Enter Prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          sx={{ backgroundColor: "#ffffff", mb: 2 }} // margin-bottom here
                      />
                      <LoadingButton
                          loading={generateLoading}
                          startIcon={<PlayArrowIcon />}
                          onClick={handleFetchData}
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#000000",
                            color: "#ffffff",
                            fontSize: '0.80rem',
                            padding: '4px 10px',
                            minWidth: '90px',
                            textTransform: 'none'
                          }}
                      >
                        Optimize
                      </LoadingButton>


                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>

            </Table>
          </TableContainer>




          {query && (
              <TableContainer component={Paper} sx={{ maxWidth: '90vw', mt: 4 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#000000', height: '32px' }}>
                    <TableRow sx={{ height: '32px' }}>
                      <TableCell sx={{ padding: '8px 16px' }}>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontSize: '0.8rem' }}>
                          Optimized Query
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                            multiline
                            fullWidth
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            sx={{
                              backgroundColor: "#c2f2d6",
                              mt: 2,
                              mb: 2,
                              fontSize: '0.85rem',
                            }}
                            InputProps={{
                              sx: { fontSize: '0.85rem', lineHeight: '1.4' }
                            }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
          )}

          {query && (
              <Box sx={{ minWidth: '100%', mt: 2 }}>
                <Divider sx={{ my: 2 }} />
                <LoadingButton
                    loading={dryRunLoading}
                    startIcon={<AccessTimeIcon />}
                    onClick={() => handleDryRun(query)}
                    variant="contained"
                    size="small"
                    color={dryRunLoading ? "secondary" : "primary"} // swap color when loading
                    sx={{
                      fontSize: '0.80rem',
                      padding: '4px 10px',
                      minWidth: '90px',
                      textTransform: 'none',
                      mt: 2,
                      mb: 3
                    }}
                >
                  Estimated Cost
                </LoadingButton>

              </Box>
          )}

          {executionData && (
              <TableContainer component={Paper} sx={{ mb: 4, maxWidth: '80%' , overflowY: 'hidden'}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Estimated Cost</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Data Processed (Bytes)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Data Processed (GB)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Data Processed (TB)</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Base Cost</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Price Per TB</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{`$${executionData.estimated_cost_usd?.toFixed(6)}`}</TableCell>
                      <TableCell>{`${executionData.bytes_processed}`}</TableCell>
                      <TableCell>{`${executionData.gigabytes_processed}`}</TableCell>
                      <TableCell>{`${executionData.terabytes_processed}`}</TableCell>
                      <TableCell>{`${executionData.base_cost_usd}$`}</TableCell>
                      <TableCell>{`$${executionData.price_per_tb_usd}`}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
          )}
          <Divider sx={{ my: 0 }} />
          {showResultsButton && (
              <LoadingButton
                  loading={resultsLoading}
                  startIcon={<PlayArrowIcon />}
                  onClick={handleInsightData}
                  variant="contained"
                  size="small"
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    minWidth: '100px',
                    textTransform: 'none'
                  }}
              >
                Show Results
              </LoadingButton>

          )}

          {data.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 4, maxWidth: '90vw'  }}>
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

        </Box>
        <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
          <DialogTitle fontWeight="bold">Query Error</DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="error">{errorMessage}</Typography>
            {errorPrompts.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>Sample Analytical Prompts:</Typography>
                  <Box component="ul" sx={{ pl: 2 }}> {/* Ensures bullet points are visible */}
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

      </Container>
  );
};

export default TechnicalAnalystTab;