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
  const textFieldRef = useRef(null);

  const handleFetchData = () => {
    setLoading(true);
  
    const promptResponses = [
      {
        keywords: ["loan", "China Development Bank"],
        query: `SELECT c.CustomerName, lt.Amount, b.BankName FROM LoanTransaction lt 
                JOIN customer c ON lt.CustomerID = c.CustomerID 
                JOIN banks b ON lt.BankID = b.BankID 
                WHERE lt.Type = 'Loan' AND b.BankName = 'China Development Bank'`,
        data: [
          { customerName: "Auto Parts Corp", loanAmount: "$300,000", bank: "China Development Bank" },
        ],
        insights: "The total loan given by China Development Bank is $300,000.",
        nextPrompts: [
          "How much loan has India National Bank given to its customers?",
          "Compare Q1 2024 loan approvals with Q1 2023.",
          "Show loan trends for 2024."
        ]
      },
      {
        keywords: ["sales", "top regions"],
        query: `SELECT region, SUM(sales) AS total_sales FROM sales_data 
                GROUP BY region ORDER BY total_sales DESC LIMIT 5`,
        data: [
          { region: "North", sales: "$500,000" },
          { region: "South", sales: "$450,000" },
          { region: "East", sales: "$420,000" },
          { region: "West", sales: "$410,000" },
          { region: "Central", sales: "$400,000" }
        ],
        insights: "The North region had the highest sales in 2024.",
        nextPrompts: [
          "What are the sales for Q2 2024?",
          "Compare sales trends between 2023 and 2024.",
          "Which product category performed best?"
        ]
      },
      {
        keywords: ["customer", "top revenue"],
        query: `SELECT CustomerName, SUM(Revenue) AS TotalRevenue 
                FROM Transactions GROUP BY CustomerName ORDER BY TotalRevenue DESC LIMIT 3`,
        data: [
          { customerName: "TechCorp Ltd.", revenue: "$1,200,000" },
          { customerName: "RetailHub Inc.", revenue: "$1,050,000" },
          { customerName: "AutoMobiles Ltd.", revenue: "$980,000" }
        ],
        insights: "TechCorp Ltd. was the highest revenue-generating customer.",
        nextPrompts: [
          "Which customer had the highest profit margin?",
          "Compare revenue trends between 2023 and 2024.",
          "Which product had the highest revenue?"
        ]
      }
    ];
  
    setTimeout(() => {
      let response = {
        query: "No data found for this prompt.",
        data: [],
        insights: "No insights available for this prompt.",
        nextPrompts: []
      };
  
      // Match the prompt against the keyword-based responses
      for (const item of promptResponses) {
        if (item.keywords.some(keyword => prompt.toLowerCase().includes(keyword.toLowerCase()))) {
          response = item;
          break;
        }
      }
  
      setQuery(response.query);
      setData(response.data);
      setInsights("");
      setNextPrompts("");
      setLoading(false);
    }, 2000);
  };  

  const handleInsightData = () => {
    setInsightLoading(true);
    const promptResponses = [
      {
        keywords: ["loan", "China Development Bank"],
        query: `SELECT c.CustomerName, lt.Amount, b.BankName FROM LoanTransaction lt 
                JOIN customer c ON lt.CustomerID = c.CustomerID 
                JOIN banks b ON lt.BankID = b.BankID 
                WHERE lt.Type = 'Loan' AND b.BankName = 'China Development Bank'`,
        data: [
          { customerName: "Auto Parts Corp", loanAmount: "$300,000", bank: "China Development Bank" },
        ],
        insights: "The total loan given by China Development Bank is $300,000.",
        nextPrompts: [
          "How much loan has India National Bank given to its customers?",
          "Compare Q1 2024 loan approvals with Q1 2023.",
          "Show loan trends for 2024.",
          "Give me top regions based on sales"
        ]
      },
      {
        keywords: ["sales", "top regions"],
        query: `SELECT region, SUM(sales) AS total_sales FROM sales_data 
                GROUP BY region ORDER BY total_sales DESC LIMIT 5`,
        data: [
          { region: "North", sales: "$500,000" },
          { region: "South", sales: "$450,000" },
          { region: "East", sales: "$420,000" },
          { region: "West", sales: "$410,000" },
          { region: "Central", sales: "$400,000" }
        ],
        insights: "The North region had the highest sales in 2024.",
        nextPrompts: [
          "What are the sales for Q2 2024?",
          "Compare sales trends between 2023 and 2024.",
          "Which product category performed best?",
          "Give me top 3 customers based on highest revenue?"
        ]
      },
      {
        keywords: ["customer", "highest revenue"],
        query: `SELECT CustomerName, SUM(Revenue) AS TotalRevenue 
                FROM Transactions GROUP BY CustomerName ORDER BY TotalRevenue DESC LIMIT 3`,
        data: [
          { customerName: "TechCorp Ltd.", revenue: "$1,200,000" },
          { customerName: "RetailHub Inc.", revenue: "$1,050,000" },
          { customerName: "AutoMobiles Ltd.", revenue: "$980,000" }
        ],
        insights: "TechCorp Ltd. was the highest revenue-generating customer.",
        nextPrompts: [
          "Which customer had the highest profit margin?",
          "Compare revenue trends between 2023 and 2024.",
          "Which product had the highest revenue?",
          "How much loan did China Development Bank gave to its customers?"
        ]
      }
    ];
    setTimeout(() => {
      let response = {
        query: "No data found for this prompt.",
        data: [],
        insights: "No insights available for this prompt.",
        nextPrompts: []
      };
  
      // Match the prompt against the keyword-based responses
      for (const item of promptResponses) {
        if (item.keywords.some(keyword => prompt.toLowerCase().includes(keyword.toLowerCase()))) {
          response = item;
          break;
        }
      }
      setInsights(response.insights);
      setNextPrompts(response.nextPrompts);
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
                    label="Enter your prompt"
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
              <Button variant="contained" color="primary" onClick={handleFetchData} sx={{ mb: 2, alignItems: 'center', typography: 'caption'}}>
                Generate
              </Button>
            </Grid>
        </Grid>
      </Box>


      {loading && <CircularProgress sx={{ mt: 2 }} />}


      {query && (

      <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={5} sx={{ alignSelf: 'flex-start' }}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ mt: 3, mb: 2, p: 2, width: "100%" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>Executed Query:</Typography>
                  <Typography variant="body2" fontFamily="monospace">{query}</Typography>
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
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <TableContainer component={Paper} sx={{ mt: 2, mb: 2, width: "100%" }}>
                      <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "#1976d2" }}>
                        Retrieved Data:
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {Object.keys(data[0]).map((key) => (
                              <TableCell key={key} sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                                {key.replace(/([A-Z])/g, " $1").trim()} {/* Formats camelCase to readable text */}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row, index) => (
                            <TableRow key={index}>
                              {Object.keys(row).map((key) => (
                                <TableCell key={key}>{row[key]}</TableCell>
                              ))}
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

export default BusinessUserTab;
