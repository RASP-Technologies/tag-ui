import React, { useState, useRef, theme } from "react";
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
  TablePagination,
  Grid,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Link,
  FormControl,
  InputLabel, 
  Select, 
  MenuItem
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { LoadingButton } from '@mui/lab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import StarIcon from '@mui/icons-material/Star';
import SendSharpIcon from '@mui/icons-material/SendSharp';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

const TechnicalAnalystTab = () => {
  const [prompt, setPrompt] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [optimizedQuery, setOptimizedQuery] = useState("");
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [inference, setInference] = useState("");
  const [nextPrompts, setNextPrompts] = useState([]);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightTimeout, setInsightTimeout] = useState(null);
  const textFieldRef = useRef(null);
  //const rowsPerPage = 5; // Number of rows per page
  const [selectedModel, setSelectedModel] = useState('openai');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const models = [
    { value: 'openai', label: 'openai' },
    { value: 'palm2', label: 'palm2' },
    { value: 'llama', label: 'llama' },
    { value: 'gemini-pro', label: 'gemini-pro' },
    { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro' }
  ];

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedModel(value);
    onModelSelect(value); // Callback to parent component
  };

  const handleFetchData = async () => {
    // Reset all data
    setQuery("");
    setOptimizedQuery("");
    setData([]);
    setInsights([]);
    setNextPrompts([]);

    setGenerateLoading(true);

    try {
      const response = await fetch("http://localhost:8082/optimise_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: prompt, // Sending prompt as 'query'
          llm_type: "openai"
        }),
      });

      if(!response.ok) {
        throw new Error('API request failed with status ${response.status}')
      }

      const apiData = await response.json();

      // Set the state with API response
      setQuery(apiData.sql_query_generated || "No query generated.");

    } catch (error) {
      console.error("Error fetching insights:", error);
      setQuery("Error generating query.");
    } finally {
      setGenerateLoading(false);
    }
  };  

  const handleInsightData = async () => {
    setInsightLoading(true);
    try {
      const response = await fetch("http://localhost:8082/generate_insights_from_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query, // Sending prompt as 'query'
          llm_type: "openai"
        }),
      });
  
      if(!response.ok) {
        throw new Error('API request failed with status ${response.status}')
      }
  
      const apiData = await response.json();
  
      // Set the state with API response
      setQuery(apiData.sql_query_generated || "No query generated.");
      setData(apiData.result || []);
      setInsights(apiData.textual_summary || []);
      setNextPrompts(apiData.followup_prompts || []);
  
    } catch (error) {
      console.error("Error fetching insights:", error);
      setQuery("Error generating query.");
      setData([]);
      setInsights("Fail to generate insights.");
      setNextPrompts([]);
    } finally {
      setInsightLoading(false);
    }
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Slice the data based on the current page and rows per page
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const displayRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  return (
   <Container maxWidth={false} disableGutters sx={{ width: "99vw", margin: 0, padding: 0,  minHeight: "100vh", display: "flex", flexDirection: "column" }}> {/* Center the content */}
     <CssBaseline />
      <Box  sx={{ mt: 2, mb: 2, width: '100%', alignItems: 'center' }}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={9.5}>
                <TextField
                    inputRef={textFieldRef}
                    autoFocus
                    fullWidth
                    label="How can I help you ?"
                    variant="outlined"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
                />
            </Grid>
            <Grid item xs={12} sm={1.5}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel id="model-select-label">LLM</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  value={selectedModel}
                  label="AI Model"
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                >
                  {models.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      {model.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={1}
                sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
              <LoadingButton loading={generateLoading} loadingPosition="start" startIcon={<PlayArrowIcon />} variant="contained" color="primary" onClick={ handleFetchData} sx={{ mb: 2, alignItems: 'center', typography: 'caption', '&:hover': { backgroundColor: '#303f9f'}}}>
                Optimize
              </LoadingButton>
            </Grid>
        </Grid>
      </Box>


{/*       {loading && <CircularProgress sx={{ mt: 2 }} />} */}

      {query && (
        <Grid container spacing={2} sx={{ mt: 1, padding: 1, margin: 0, width: '100vw', border: '1px solid #ccc'}}>
          <Grid item xs={12} sm={6} sx={{ alignSelf: 'flex-start'}}>
            <Box
                  sx={{
                    width: '100%',
                    mb: 2,
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                      backgroundColor: '#eaecec', // Background color for the header
                      color: 'black',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      User Input Query
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <ContentCopyOutlinedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton size="small">
                        <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* SQL Content */}
                  <Box
                    sx={{
                      p: 2,
                      //backgroundColor: (theme) => theme.palette.primary.dark, // Dark blue background
                      backgroundColor: '#bbdffc',
                      color: 'black',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto',
                    }}
                  >
                    {prompt}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton loading={insightLoading} loadingPosition="start" startIcon={<PlayArrowIcon />} variant="contained" color="primary" onClick={handleInsightData} sx={{ mb: 2, alignSelf: 'flex-end', typography: 'caption', '&:hover': { backgroundColor: '#303f9f'}}}>
                                                  Get Insights
                  </LoadingButton>
                </Box>
          </Grid>
{/*            { insightLoading && <CircularProgress sx={{ mt: 2 }} />} */}

          { query && (
              <Grid item xs={12} sm={6} sx={{ alignSelf: 'flex-start'}}>
                <Box
                      sx={{
                        width: '100%',
                        maxWidth: '900px',
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: 1,
                        bgcolor: 'background.paper',
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          px: 2,
                          py: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                          backgroundColor: '#eaecec', // Background color for the header
                          color: 'black',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          Optimized Query
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <ContentCopyOutlinedIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                          <IconButton size="small">
                            <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* SQL Content */}
                      <Box
                        sx={{
                          p: 2,
                          //backgroundColor: (theme) => theme.palette.primary.dark, // Dark blue background
                          backgroundColor: '#defaec',
                          color: 'black',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto',
                        }}
                      >
                        {query}
                      </Box>
                    </Box>
              </Grid>
          )}
      </Grid>

      )}

{/*       {query && ( */}


{/*    )} */}

{/*      { insightLoading && <CircularProgress sx={{ mt: 2 }} />} */}

    {  insights.length > 0 && (

      <Grid container bgcolor='white' spacing={2} sx={{ mt: 1, padding: 1, margin: 0, width: '100vw', border: '1px solid #ccc', height: '700px'}}>
                <Grid item xs={12} sm={6}>
                      {data.length > 0 && (
                          <Box
                              sx={{
                                width: '100%',
                                maxWidth: '900px',
                                borderRadius: 1,
                                overflow: 'hidden',
                                boxShadow: 1,
                                bgcolor: 'background.paper',
                              }}
                          >
                              {/* Header */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              px: 2,
                              py: 1,
                              borderBottom: 1,
                              borderColor: 'divider',
                              backgroundColor: '#eaecec', // Background color for the header
                              color: 'black',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              Retrieved Data
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small">
                                <ContentCopyOutlinedIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                              <IconButton size="small">
                                <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Box>
                          </Box>
                              <Box sx={{
                                           padding: '20px', // Adjust the padding value as needed
      //                                      border: '1px solid #ccc', // Optional: Adds a border for better visualization
      //                                      borderRadius: '4px', // Optional: Rounds the corners
                                           backgroundColor: 'white', // Optional: Adds a background color
                                           display: 'flex', // Optional: Aligns content inside the box
                                           justifyContent: 'center', // Optional: Centers content horizontally
                                           alignItems: 'center', // Optional: Centers content vertically
      //                                      width: '700px', // Optional: Sets the width of the box
      //                                      height: '200px', // Optional: Sets the height of the box
                                         }}
                                     >
                                <TableContainer  sx={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                                  <Table stickyHeader>
                                    <TableHead sx={{
                                       '& .MuiTableCell-head': {
                                         backgroundColor: '#f5f5f5', // Background color for the header
                                         color: 'black', // Text color for the header
                                       },
                                     }}>
                                      <TableRow>
                                        {Object.keys(data[0]).map((key) => (
                                          <TableCell key={key} sx={{ fontWeight: "bold", textTransform: "capitalize", borderRight: '1px solid #ccc' }}>
                                            {key.replace(/([A-Z])/g, " $1").trim()} {/* Formats camelCase to readable text */}

                                          </TableCell>
                                        ))}

                                      </TableRow>
                                    </TableHead>

                                    <TableBody sx={{  overflowY: 'auto' }} >
                                    {displayRows.map((row, index) => (
                                      <TableRow key={index}>
                                          {Object.keys(row).map((key) => (
                                            <TableCell sx={{ borderRight: '1px solid #ccc' }} key={key}>{row[key]}</TableCell>
                                          ))}
                                      </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                      <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={5} />
                                      </TableRow>
                                    )}
                                  </TableBody>


      {/*                               <TableBody sx={{ border: '1px solid #ccc' }}> */}
      {/*                                 {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => ( */}
      {/*                                   <TableRow key={index}> */}
      {/*                                     {Object.keys(row).map((key) => ( */}
      {/*                                       <TableCell sx={{ borderRight: '1px solid #ccc' }} key={key}>{row[key]}</TableCell> */}
      {/*                                     ))} */}
      {/*                                   </TableRow> */}
      {/*                                 ))} */}
      {/*                               </TableBody> */}
                                  </Table>
                                </TableContainer>



                                </Box>
                                    <TablePagination
                                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                          component="div"
                                          count={data.length}
                                          rowsPerPage={rowsPerPage}
                                          page={page}
                                          onPageChange={handleChangePage}
                                          onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
      {/*                           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}> */}
      {/*                             {Array.from({ length: Math.ceil(data.length / rowsPerPage) }, (_, index) => ( */}
      {/*                               <Button */}
      {/*                                 key={index} */}
      {/*                                 variant={page === index ? "contained" : "outlined"} */}
      {/*                                 onClick={() => setPage(index)} */}
      {/*                                 sx={{ mx: 0.5 }} */}
      {/*                               > */}
      {/*                                 {index + 1} */}
      {/*                               </Button> */}
      {/*                             ))} */}
      {/*                           </Box> */}
                             </Box>
                      )}
      {/*                 {data.length > 0 && ( */}
      {/*                 <Button variant="contained" color="primary" onClick={handleInsightData} sx={{ mt: 2 }}> */}
      {/*                   Get Insights */}
      {/*                 </Button> */}
      {/*               )} */}
                </Grid>

                <Grid item xs={12} sm={5.9} sx={{ alignSelf: 'flex-start'}}>
                    <Box
                      sx={{
                        width: '100%',
                        mb: 2,
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: 1,
                        bgcolor: 'background.paper',
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          px: 2,
                          py: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                          backgroundColor: '#eaecec', // Background color for the header
                          color: 'black',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          Insights
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <ContentCopyOutlinedIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                          <IconButton size="small">
                            <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* SQL Content */}
                      <Box
                        sx={{
                          p: 2,

                          color: 'black',
                          //fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto',
                        }}
                      >
                        {insights.map((p, index) => (
                            <List sx={{ padding: 0 }}>
                               <ListItem sx={{ py: 0.5 }}>
                                   <ListItemIcon >
                                   <SendSharpIcon sx={{ fontSize: 'large' }} />
                                   </ListItemIcon>
                                    <Typography variant="body2" component="span">
                                         {p}
                                    </Typography>

                               </ListItem>
                            </List>
                        ))}
                      </Box>
                    </Box>

                    { nextPrompts.length > 0 && (
                    <Box
                      sx={{
                        width: '100%',
                        mb: 2,
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: 1,
                        bgcolor: 'background.paper',
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          px: 2,
                          py: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                          backgroundColor: '#eaecec', // Background color for the header
                          color: 'black',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          Suggested Next Prompts:
                        </Typography>
                        <Box variant="subtitle2" sx={{ display: 'flex', gap: 1 }}>
{/*                           <IconButton size="small"> */}
{/*                             <ContentCopyOutlinedIcon sx={{ fontSize: 20 }} /> */}
{/*                           </IconButton> */}
{/*                           <IconButton size="small"> */}
{/*                             <PedalBikeIcon sx={{ fontSize: 18 }} /> */}
{/*                           </IconButton> */}
                        </Box>
                      </Box>

                      {/* SQL Content */}
                      <Box
                        sx={{
                          p: 2,

                          color: 'black',
                          //fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto',
                        }}
                      >

                          { nextPrompts.map((p, index) => (

                              <List sx={{ padding: 0 }}>
                                 <ListItem sx={{ py: 0.5 }}>
                                     <ListItemIcon >

                                             <SendSharpIcon sx={{ fontSize: 'large' }} />
                                     </ListItemIcon>
                                      <Typography key={index}  variant="body1" component="span">
                                           <Link
                                               align="left"
                                               component="button"
                                               color="primary"
                                               underline="hover"
                                               onClick={() => handleLinkClick(p)}
                                               sx={{
                                                 typography: 'body1',

                                                 cursor: 'pointer'
                                               }}
                                             >
                                           {p}
                                        </Link>
                                      </Typography>

                                 </ListItem>
                              </List>

                          ))}

                      </Box>

                    </Box>
                  )}
                </Grid>

      </Grid>

      )}


    </Container>
  );
};

export default TechnicalAnalystTab;
