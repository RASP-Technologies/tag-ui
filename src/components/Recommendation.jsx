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
  TablePagination,
  TableRow,
  Paper,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
  Alert as MuiAlert,
  Grid,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
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
import { subDays, format } from 'date-fns';

// Styled components
const SummaryBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#e3f2fd',
  borderRadius: '8px',
  textAlign: 'center', // Center text in summary box
}));

const TimeRangeBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#defaec',
  borderRadius: '8px',
  textAlign: 'center', // Center text in summary box
}));

const CategoriesContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between', // Adjusts spacing between boxes
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
}));

const Recommendation = () => {

  const [viewReportLoading, setViewReportLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [recommendationsReport, setRecommendationsReport] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);


  // State for time range
  const [startTime, setStartTime] = useState(subDays(new Date(), 1));
  const [endTime, setEndTime] = useState(new Date());

  const [loading, setLoading] = useState(false); // New loading state

    const recommendations = [
    {
      category: 'Data_Model',
      recommendation: 'Remove Or Purge Duplicate Data to reduce Storage Cost',
      files: 'cm_event_assignee_backup',
      improvementCategory: 'Cost-Optimization',
      lastUsed: '9 Months ago',
      queryChange: 'No',
      appChange: 'No',
      schemaChange: 'No',
      previousQuery: 'NA',
      optimizedQuery: 'NA',
    },
    {
      category: 'Data_Model',
      recommendation: 'The 50 GB table can be strategically transitioned from hot to warm storage, with archival to cold storage for long-term, cost-optimized retention.',
      files: 'cm_event_history',
      improvementCategory: 'Cost-Optimization',
      lastUsed: '6 Months ago',
      queryChange: 'No',
      appChange: 'No',
      schemaChange: 'No',
      previousQuery: 'NA',
      optimizedQuery: 'NA',
    },
{
      category: 'Code_Refactoring',
      recommendation: 'Repeated subqueries, no aggregation optimization',
      files: 'FraudDetection.sql',
      improvementCategory: 'Performance-Optimization',
      lastUsed: '1 day ago',
      queryChange: 'Yes',
      appChange: 'No',
      schemaChange: 'No',
      previousQuery: `
      SELECT
            customer_portfolio_channel,
            COUNT(*) AS total_transactions,
            SUM(CASE WHEN outcome_fraud = TRUE THEN 1 ELSE 0 END) AS fraud_transactions,
            (SELECT COUNT(*)
             FROM cm_event_arrival
             WHERE id.payload.schema.customer_portfolio_channel = e.customer_portfolio_channel
             AND alert = TRUE) AS total_alerts,
            (SUM(CASE WHEN outcome_fraud = TRUE THEN sender_transaction_amount ELSE 0 END) /
             NULLIF(COUNT(*), 0)) AS avg_fraud_amount
        FROM event_store e
        GROUP BY customer_portfolio_channel
        ORDER BY fraud_transactions DESC;`,
      optimizedQuery: `WITH ChannelMetrics AS (
                           SELECT
                               e.customer_portfolio_channel,
                               COUNT(*) AS total_transactions,
                               COUNTIF(e.outcome_fraud) AS fraud_transactions,
                               SUM(CASE WHEN e.outcome_fraud THEN e.sender_transaction_amount ELSE 0 END) AS total_fraud_amount,
                               COUNT(DISTINCT CASE WHEN a.alert = TRUE THEN a.id.identifier END) AS total_alerts
                           FROM event_store e
                           LEFT JOIN cm_event_arrival a ON e.lifecycle_id = a.id.identifier
                           GROUP BY e.customer_portfolio_channel
                       )
                       SELECT
                           customer_portfolio_channel,
                           total_transactions,
                           fraud_transactions,
                           total_alerts,
                           SAFE_DIVIDE(total_fraud_amount, total_transactions) AS avg_fraud_amount,
                           SAFE_DIVIDE(fraud_transactions, total_transactions) * 100 AS fraud_rate
                       FROM ChannelMetrics
                       ORDER BY fraud_transactions DESC;
`,
    },
    {
      category: 'Code_Refactoring',
      recommendation: 'Full table scan, no indexing, suboptimal joins',
      files: 'RiskAnalysis.sql',
      improvementCategory: 'Performance-Optimization',
      lastUsed: '1 day ago',
      queryChange: 'Yes',
      appChange: 'Yes',
      schemaChange: 'No',
      previousQuery: `SELECT
                          e.lifecycle_id,
                          e.customer_id,
                          e.sender_transaction_amount,
                          e.event_type,
                          s.username AS confirmed_by,
                          (SELECT AVG(sender_transaction_amount)
                           FROM event_store
                           WHERE customer_portfolio_type = e.customer_portfolio_type) AS avg_portfolio_amount
                      FROM event_store e
                      LEFT JOIN cm_event_state_updates s ON e.lifecycle_id = s.ids[OFFSET(0)].identifier
                      WHERE e.outcome_fraud = TRUE
                          AND e.sender_transaction_amount > (
                              SELECT AVG(sender_transaction_amount) * 1.5
                              FROM event_store
                              WHERE customer_portfolio_type = e.customer_portfolio_type
                          )
                      ORDER BY e.sender_transaction_amount DESC
                      LIMIT 100;
`,
      optimizedQuery: `
      WITH PortfolioStats AS (
                                 SELECT
                                     customer_portfolio_type,
                                     AVG(sender_transaction_amount) AS avg_amount,
                                     STDDEV(sender_transaction_amount) AS stddev_amount
                                 FROM event_store
                                 WHERE outcome_fraud = TRUE
                                 GROUP BY customer_portfolio_type
                             )
                             SELECT
                                 e.lifecycle_id,
                                 e.customer_id,
                                 e.sender_transaction_amount,
                                 e.event_type,
                                 s.username AS confirmed_by,
                                 ps.avg_amount AS portfolio_avg_amount
                             FROM event_store e
                             JOIN PortfolioStats ps ON e.customer_portfolio_type = ps.customer_portfolio_type
                             LEFT JOIN cm_event_state_updates s ON e.lifecycle_id = s.ids[OFFSET(0)].identifier
                             WHERE e.outcome_fraud = TRUE
                                 AND e.sender_transaction_amount > (ps.avg_amount + 1.5 * ps.stddev_amount)
                             ORDER BY e.sender_transaction_amount DESC
                             LIMIT 100;`
    },
    {
      category: 'Code_Refactoring',
      recommendation: 'Use Merge Statement where Delete/Insert/Update used separately',
      files: 'Incremetal_Load_Employees_BKP_SLOW.sql, test.sql',
      improvementCategory: 'Performance-Optimization',
      lastUsed: '2 day ago',
      queryChange: 'No',
      appChange: 'No',
      schemaChange: 'No',
      previousQuery: 'NA',
      optimizedQuery: 'NA',
    },
    {
      category: 'Code_Refactoring',
      recommendation: 'Some SQLs running too frequently, frequency can be reduced to save cost',
      files: 'Load_Employee.sql',
      improvementCategory: 'Cost-Optimization',
      lastUsed: '1 day ago',
      queryChange: 'No',
      appChange: 'Yes',
      schemaChange: 'No',
      previousQuery: 'NA',
      optimizedQuery: 'NA',
    },
    {
       category: 'Code_Refactoring',
       recommendation: 'Some queries appear as duplicate ',
       files: 'Load_Account_Details.sql, Load_AcntDetails.sql',
       improvementCategory: 'Cost-Optimization',
       lastUsed: '1 day ago',
       queryChange: 'No',
       appChange: 'Yes',
       schemaChange: 'No',
       previousQuery: 'NA',
       optimizedQuery: 'NA',
    }
];
  useEffect(() => {
    // Set the end time to the current time when the component mounts
    const now = new Date();
    setStartTime(subDays(new Date(), 1));
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

    const handleViewReportClick = () => {
      setViewReportLoading(true);
      // Simulate an async operation
      setTimeout(() => {
        setViewReportLoading(false);
      }, 2000); // 2 seconds delay
    };

    const handleViewReportData = () => {
        setViewReportLoading(true);
        setTimeout(() => {
         setRecommendationsReport(recommendations);
         setViewReportLoading(false);
        }, 2000);
    };
  // Summary counts
  const summaryCounts = {
    schemasAnalyzed: 5, // Example count
    sqlFilesAnalyzed: 56,//recommendations.length,
    recommendations: recommendations.length, // Example count
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
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - recommendations.length) : 0;
    const displayRows = recommendations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false} disableGutters sx={{ width: "99vw", margin: 0, padding: 0,  minHeight: "100vh", display: "flex", flexDirection: "column" }}> {/* Center the content */}
      <CssBaseline />
        <Grid container spacing={2} sx={{ mt: 0, padding: 0, margin: 0, width: '100vw'
                //, border: '1px solid #ccc'
                }}>
        <Grid item xs={12} sm={6.8} sx={{ alignSelf: 'flex-start'}}>
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
                    Analysis Summary
                  </Typography>
{/*                   <Box sx={{ display: 'flex', gap: 1 }}> */}
{/*                     <IconButton size="small"> */}
{/*                       <ContentCopyOutlinedIcon sx={{ fontSize: 20 }} /> */}
{/*                     </IconButton> */}
{/*                     <IconButton size="small"> */}
{/*                       <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} /> */}
{/*                     </IconButton> */}
{/*                   </Box> */}
                </Box>

                {/* SQL Content */}
                <Box
                  sx={{
                    p: 2,
                    //backgroundColor: (theme) => theme.palette.primary.dark, // Dark blue background
                    //backgroundColor: '#bbdffc',
                    color: 'black',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                    height: 210,
                  }}
                >

              <Grid container spacing={0} sx={{ mt: 1, padding: 0, margin: 0
                              //, border: '1px solid #ccc'
                              }}>
                      <Grid item xs={12} sm={4} sx={{ alignSelf: 'flex-start'}}>
                            <SummaryBox>
                              <Typography variant="h6">
                               Schema Analyzed
                              </Typography>
                              <Typography variant="h3">
                                {summaryCounts.schemasAnalyzed}
                              </Typography>
                            </SummaryBox>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ alignSelf: 'flex-start'}}>
                            <SummaryBox>
                              <Typography variant="h6">
                               Queries Analyzed
                              </Typography>
                              <Typography variant="h3">
                                {summaryCounts.sqlFilesAnalyzed}
                              </Typography>
                            </SummaryBox>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ alignSelf: 'flex-start'}}>
                            <SummaryBox>
                              <Typography variant="h6">
                                Recommendations
                              </Typography>
                              <Typography variant="h3">
                                {summaryCounts.recommendations}
                              </Typography>
                            </SummaryBox>
                      </Grid>
                      </Grid>

                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={5} sx={{ alignSelf: 'flex-start'}}>
                <Box
                      sx={{
                        mb: 2,
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
                          Time Range
                        </Typography>
                      </Box>

                      {/* SQL Content */}
                      <Box
                        sx={{
                          p: 2,
                          //backgroundColor: (theme) => theme.palette.primary.dark, // Dark blue background
                          //backgroundColor: '#defaec',
                          color: 'black',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto',
                          height: 210,
                        }}
                      >
{/*                         <CategoriesContainer> */}
                        <Grid container spacing={0} sx={{ mt: 1, padding: 0, margin: 0
                                          //, border: '1px solid #ccc'
                                          }}>
                          <Grid item xs={12} sm={6} sx={{ alignSelf: 'flex-start'}}>
                              <TimeRangeBox>
                                <Typography variant="h6">
                                 Start Time
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold'}}>
                                  {startTime ? format(startTime, 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                                </Typography>
                              </TimeRangeBox>
                          </Grid>
                          <Grid item xs={12} sm={6} sx={{ alignSelf: 'flex-start'}}>
                          <TimeRangeBox>
                            <Typography variant="h6">
                              End Time
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold'}}>
                              {endTime ? format(endTime, 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                            </Typography>
                          </TimeRangeBox>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton loading={viewReportLoading} loadingPosition="start" startIcon={<PlayArrowIcon />} variant="contained"
                      color="primary" onClick={handleViewReportData}
                      sx={{ mb: 2, alignItems: 'center', typography: 'caption', '&:hover': { backgroundColor: '#303f9f'}}}>
                        View Report
                      </LoadingButton>
                    </Box>
              </Grid>

        </Grid>

        { recommendationsReport.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 1, padding: 1, margin: 0, width: '100vw'
                        , border: '1px solid #ccc'
                        }}>
                  <Grid item xs={12} sm={11.8} sx={{ alignSelf: 'flex-start'}}>
                        <Box
                              sx={{
                                width: '100%',
                                //maxWidth: '900px',
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
                              Recommendation Report
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
                //         border: '1px solid #ccc', // Optional: Adds a border for better visualization
                //         borderRadius: '4px', // Optional: Rounds the corners
                               backgroundColor: 'white', // Optional: Adds a background color
                               display: 'flex', // Optional: Aligns content inside the box
                               justifyContent: 'center', // Optional: Centers content horizontally
                               alignItems: 'center', // Optional: Centers content vertically
                //          width: '700px', // Optional: Sets the width of the box
                //          height: '200px', // Optional: Sets the height of the box
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
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Category</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Recommendation</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Files/Queries</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Optimization Category</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Last Used</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Query Change Required</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Application Code Change Required</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Schema Change Required</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Action</TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody sx={{  overflowY: 'auto' }} >
                                        {displayRows.map((rec, index) => (
                                            <TableRow key={index}
                                            sx={{
                                                        '& .MuiTableCell-root': {
                                                          color: rec.improvementCategory === 'Cost-Optimization' ? 'green' : 'blue',
                                                        },
                                                    }}>
                                              <TableCell align="center">{rec.category}</TableCell>
                                              <TableCell align="center">{rec.recommendation}</TableCell>
                                              <TableCell align="center">{rec.files}</TableCell>
                                              <TableCell align="center">{rec.improvementCategory}</TableCell>
                                              <TableCell align="center">{rec.lastUsed}</TableCell>
                                              <TableCell align="center">{rec.queryChange}</TableCell>
                                              <TableCell align="center">{rec.appChange}</TableCell>
                                              <TableCell align="center">{rec.schemaChange}</TableCell>
                                              <TableCell align="center">
                                                <StyledButton disabled={rec.queryChange === 'No'}
                                                sx={{ backgroundColor: rec.queryChange === 'No' ? 'grey' : '#1976d2' }}
                                                onClick={() => handleApplyRecommendation(rec)}>
                                                  Optimize
                                                </StyledButton>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                          {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                              <TableCell colSpan={5} />
                                            </TableRow>
                                          )}
                                  </TableBody>
                                  </Table>
                                </TableContainer>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                                    <TablePagination
                                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                          component="div"
                                          count={recommendationsReport.length}
                                          rowsPerPage={rowsPerPage}
                                          page={page}
                                          onPageChange={handleChangePage}
                                          onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Box>
                         </Box>
                </Grid>
            </Grid>
        )}
      <Box sx={{ mt: 2, mb: 2, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <MuiAlert onClose={handleCloseSnackbar} severity="info">
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
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

export default Recommendation;