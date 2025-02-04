import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
  Alert as MuiAlert,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

// Styled components
const SummaryBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#e3f2fd',
  borderRadius: '8px',
  textAlign: 'center', // Center text in summary box
}));

const CategoriesContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between', // Adjusts spacing between boxes
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
}));

const App = () => {
  const [recommendations] = useState([
    {
      category: 'Performance',
      recommendation: 'Optimize JOIN operations',
      files: 'query1.sql',
      queryChange: 'Yes',
      appChange: 'No',
      schemaChange: 'No',
      previousQuery: 'SELECT * FROM table1 JOIN table2 ON table1.id = table2.id',
      optimizedQuery: 'SELECT table1.col1, table2.col2 FROM table1 JOIN table2 ON table1.id = table2.id',
    },
    {
      category: 'Cost',
      recommendation: 'Reduce data scanned',
      files: 'query2.sql',
      queryChange: 'Yes',
      appChange: 'Yes',
      schemaChange: 'No',
      previousQuery: 'SELECT * FROM large_table',
      optimizedQuery: 'SELECT col1, col2 FROM large_table WHERE condition = true',
    },
    {
      category: 'Readability',
      recommendation: 'Use CTEs for complex queries',
      files: 'query3.sql',
      queryChange: 'No',
      appChange: 'No',
      schemaChange: 'No',
      previousQuery: 'SELECT * FROM (SELECT * FROM table1) AS subquery',
      optimizedQuery: 'WITH subquery AS (SELECT * FROM table1) SELECT * FROM subquery',
    },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);


  // State for time range
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    // Set the end time to the current time when the component mounts
    const now = new Date();
    setEndTime(now);
  }, []);

  const handleApplyRecommendation = (rec) => {
    setCurrentRecommendation(rec);
    setDialogOpen(true);
    setLoading(true); // Set loading to true when the button is clicked

    // Simulate processing delay (e.g., 2 seconds)
    setTimeout(() => {
      setLoading(false); // Stop loading after delay
    }, 2000);

  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmApply = () => {
    const recommendedQuery = `File Saved at: optimised/${currentRecommendation.files}`;
    setSnackbarMessage(recommendedQuery);
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  // Summary counts
  const summaryCounts = {
    schemasAnalyzed: 5, // Example count
    sqlFilesAnalyzed: recommendations.length,
    logsAnalyzed: 10, // Example count
  };

  return (
    <Container maxWidth="xl" sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Center the content */}
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            BigQuery Recommendation & Optimizer
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 2, mb: 2, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>        
        {/* Time Range Display */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6">Time Range</Typography>
          <Typography variant="body1">
            From: {startTime.toLocaleString()} To: {endTime.toLocaleString()}
          </Typography>
        </Box>
        <CategoriesContainer>
          <SummaryBox>
            <Typography variant="h6">
             Schema Analyzed
            </Typography>
            <Typography variant="h3">
              {summaryCounts.schemasAnalyzed}
            </Typography>
          </SummaryBox>
          <SummaryBox>
            <Typography variant="h6">
             Queries Analyzed
            </Typography>
            <Typography variant="h3">
              {summaryCounts.sqlFilesAnalyzed}
            </Typography>
          </SummaryBox>
          <SummaryBox>
            <Typography variant="h6">
              Logs Analyzed
            </Typography>
            <Typography variant="h3">
              {summaryCounts.logsAnalyzed}
            </Typography>
          </SummaryBox>
        </CategoriesContainer>

        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: '0px 2px 5px rgba(0,0,0,0.1)', width: '100%', maxWidth: 'none' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Recommendation</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Files/Queries</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>Query Change Required</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>Application Code Change Required</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>Schema Change Required</TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recommendations.map((rec, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{rec.category}</TableCell>
                  <TableCell align="left">{rec.recommendation}</TableCell>
                  <TableCell align="left">{rec.files}</TableCell>
                  <TableCell align="center">{rec.queryChange}</TableCell>
                  <TableCell align="center">{rec.appChange}</TableCell>
                  <TableCell align="center">{rec.schemaChange}</TableCell>
                  <TableCell align="center">
                    <StyledButton onClick={() => handleApplyRecommendation(rec)}>
                      Optimize
                    </StyledButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <MuiAlert onClose={handleCloseSnackbar} severity="info">
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle fontWeight="bold">Query Comparator</DialogTitle>
          <DialogContent>
            {loading ? (
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="150px">
                <CircularProgress />
                <Typography variant="body1" fontWeight="bold" sx={{ mt: 2 }}>
                  Optimizing Query...
                </Typography>
              </Box>
            ) : (
              currentRecommendation && (
                <>
                  <Typography variant="body1" color="error" fontWeight="bold">Previous Query:</Typography>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }} fontFamily="monospace">
                    {currentRecommendation.previousQuery}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '16px' }} color="success" fontWeight="bold">Optimized Query:</Typography>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }} fontFamily="monospace">
                    {currentRecommendation.optimizedQuery}
                  </Typography>
                </>
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
            <Button onClick={handleConfirmApply} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default App;