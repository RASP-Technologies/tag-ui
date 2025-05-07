import React, { useState, useEffect } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
    CircularProgress,
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
    padding: theme.spacing(3.5),
    backgroundColor: '#defaec',
    borderRadius: '8px',
    textAlign: 'center', // Center text in summary box
}));

const CategoriesContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between', // Adjusts spacing between boxes
});

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: "theme.palette.primary.main",
    color: '#fff',
    '&:hover': {
        backgroundColor: '#ba1110',
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
    const [SchemaAnalyzed, setSchemaAnalyzed] = useState(0); // New loading state
    const [QueriesAnalyzed, setQueriesAnalyzed] = useState(0); // N
    const [Recommendation, setRecommendation] = useState(0);
    const [showTable, setShowTable] = useState(false);

    // Helper to convert timestamp to "x days/months ago"
    function formatLastUsed(timestamp) {
        if (!timestamp) return "N/A"; // Handle null or undefined timestamps

        const now = new Date();
        const lastUsedDate = new Date(timestamp);
        const diffTime = Math.abs(now - lastUsedDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return "Today";
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 30) return `${diffDays} days ago`;

        const months = Math.floor(diffDays / 30);
        return `${months} Month${months > 1 ? "s" : ""} ago`;
    }

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
        setShowTable(true);
        setViewReportLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8082/fetch-data/");
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status}`);
                }
                const result = await response.json();
                // Transform API response to match the required structure
                const transformedData = result.data.map((item) => ({
                    category: item.category,
                    recommendation: item.recommendation,
                    optimizationCategory: item.optimisation_category,
                    referenceQuery: item.reference_query,
                    queryCount: item.no_of_queries,
                    referenceQueryId: item.reference_query_id,
                    lastUsed: formatLastUsed(item.last_used),
                    queryChange: item.query_change_required ? "Yes" : "No",
                    appChange: item.application_code_change_required ? "Yes" : "No",
                    schemaChange: item.schema_change_required ? "Yes" : "No",
                    previousQuery: item.sample_query|| "NA",
                    optimizedQuery: item.recommendation|| "NA",
                }));
                console.log(transformedData);
                setRecommendationsReport(transformedData);
                setViewReportLoading(false);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };
        fetchData();
    };

    // Summary counts
    const summaryCounts = {
        schemasAnalyzed: SchemaAnalyzed, // Example count
        sqlFilesAnalyzed: QueriesAnalyzed, // Use recommendationsReport.length for dynamic count
        recommendations: recommendationsReport.length, // Dynamic count
    };

    // Function to fetch summary counts from two different APIs
    const fetchSummaryCounts = async () => {
        try {
            // Call first API for schemasAnalyzed
            const response1 = await fetch('http://localhost:8082/fetch-count/schema');
            const data1 = await response1.json();
            console.log("DATA1" + data1.data[0]?.total_schemas)
            setSchemaAnalyzed(data1.data[0]?.total_schemas || 0);

            // Second API for sqlFilesAnalyzed
            const response2 = await fetch('http://localhost:8082/fetch-count/queries');
            const data2 = await response2.json();
            console.log("DATA2 " + data2.data[0]?.total_schemas)
            const sqlFiles = data2?.data?.[0]?.total_schemas || 0;
            setRecommendation(sqlFiles);

            // Third API for sqlFilesAnalyzed
            const response3 = await fetch('http://localhost:8082/fetch-count/totalscanned');
            const data3 = await response3.json();
            console.log("DATA3 " + data3.data[0]?.total_query_scanned)
            const sqlFiles2 = data3?.data?.[0]?.total_query_scanned || 0;
            setQueriesAnalyzed(sqlFiles2);


            // Return the object with updated values
            return {

            };
        } catch (error) {
            console.error('Error fetching summary counts:', error);
            return {
                schemasAnalyzed: 0,
                sqlFilesAnalyzed: 0,
            };
        }
    };

    useEffect(() => {
        fetchSummaryCounts();
    }, []); // Empty dependency array ensures this runs only once on mount


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
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - recommendationsReport.length) : 0;
    const displayRows = recommendationsReport.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                width: "99vw",
                margin: 0,
                padding: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CssBaseline />
            <Grid container spacing={2} sx={{ mt: 0, padding: 0, margin: 0, width: '100vw' }}>
                {/* Analysis Summary Section */}
                <Grid item xs={12} sm={6.8} sx={{ alignSelf: 'flex-start' }}>
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
                                backgroundColor: '#000000', // Background color for the header
                                color: 'black',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                Analysis Summary
                            </Typography>
                        </Box>
                        {/* SQL Content */}
                        <Box
                            sx={{
                                p: 2,
                                color: 'black',
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                whiteSpace: 'pre-wrap',
                                overflowX: 'auto',
                                height: 210,
                            }}
                        >
                            <Grid container spacing={0} sx={{ mt: 1, padding: 0, margin: 0 }}>
                                <Grid item xs={12} sm={4} sx={{ alignSelf: 'flex-start' }}>
                                    <SummaryBox>
                                        <Typography variant="h6">Schema Analyzed</Typography>
                                        <Typography variant="h3">{SchemaAnalyzed}</Typography>
                                    </SummaryBox>
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ alignSelf: 'flex-start' }}>
                                    <SummaryBox>
                                        <Typography variant="h6">Queries Analyzed</Typography>
                                        <Typography variant="h3">{QueriesAnalyzed}</Typography>
                                    </SummaryBox>
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ alignSelf: 'flex-start' }}>
                                    <SummaryBox>
                                        <Typography variant="h6">Recommendations</Typography>
                                        <Typography variant="h3">{Recommendation}</Typography>
                                    </SummaryBox>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>

                {/* Time Range Section */}
                <Grid item xs={12} sm={5} sx={{ alignSelf: 'flex-start' }}>
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
                                backgroundColor: '#000000', // Background color for the header
                                color: 'black',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'white',
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
                                color: 'black',
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                whiteSpace: 'pre-wrap',
                                overflowX: 'auto',
                                height: 210,
                            }}
                        >
                            <Grid container spacing={0} sx={{ mt: 1, padding: 0, margin: 0 }}>
                                <Grid item xs={12} sm={6} sx={{ alignSelf: 'flex-start' }}>
                                    <TimeRangeBox>
                                        <Typography variant="h6">Start Time</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            2025-05-02 00:00:00
                                        </Typography>
                                    </TimeRangeBox>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ alignSelf: 'flex-start' }}>
                                    <TimeRangeBox>
                                        <Typography variant="h6">End Time</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            2025-05-02 23:59:59
                                        </Typography>
                                    </TimeRangeBox>
                                </Grid>
                            </Grid>

                        </Box>
                    </Box>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton
                            loading={viewReportLoading}
                            loadingPosition="start"
                            startIcon={<PlayArrowIcon />}
                            variant="contained"
                            color="primary"
                            onClick={handleViewReportData}
                            sx={{
                                mb: 2,
                                alignItems: 'center',
                                typography: 'caption',

                            }}
                        >
                            View Report
                        </LoadingButton>
                    </Box>
                </Grid>
            </Grid>

            {/* Recommendation Report Table */}
            {showTable  && recommendationsReport.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 1, padding: 1, margin: 0, width: '100vw', border: '1px solid #ccc' }}>
                    <Grid item xs={12} sm={11.8} sx={{ alignSelf: 'flex-start' }}>
                        <Box
                            sx={{
                                width: '100%',
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
                                    backgroundColor: '#000000',
                                    color: 'black',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'white',
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
                                        <ContentCopyOutlinedIcon sx={{ fontSize: 20, color: 'white' }} />
                                    </IconButton>
                                    <IconButton size="small">
                                        <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20, color: 'white' }} />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Table with horizontal scroll */}
                            <Box
                                sx={{
                                    padding: '20px',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Box sx={{ overflowX: 'auto', width: '100%' }}>
                                    <TableContainer sx={{ minWidth: 1200, border: '1px solid #ccc', borderRadius: '4px' }}>
                                        <Table stickyHeader>
                                            <TableHead
                                                sx={{
                                                    '& .MuiTableCell-head': {
                                                        backgroundColor: '#f5f5f5',
                                                        color: 'black',
                                                    },
                                                }}
                                            >
                                                <TableRow>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Category</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Optimization Category</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Recommendation</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Query Count</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Reference Query</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Reference Query ID</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Query Change Required</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Application Code Change Required</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Schema Change Required</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Hints</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{ overflowY: 'auto' }}>
                                                {displayRows.map((rec, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '& .MuiTableCell-root': {
                                                                color: rec.improvementCategory === 'Cost-Optimization' ? 'green' : 'blue',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell align="center">{rec.category}</TableCell>
                                                        <TableCell align="center">{rec.optimizationCategory}</TableCell>
                                                        <TableCell align="center">{rec.recommendation}</TableCell>
                                                        <TableCell align="center">{rec.queryCount}</TableCell>
                                                        <TableCell align="center">{rec.referenceQuery}</TableCell>
                                                        <TableCell align="center">{rec.referenceQueryId}</TableCell>
                                                        <TableCell align="center">{rec.queryChange}</TableCell>
                                                        <TableCell align="center">{rec.appChange}</TableCell>
                                                        <TableCell align="center">{rec.schemaChange}</TableCell>
                                                        <TableCell align="center">
                                                            <StyledButton
                                                                disabled={rec.queryChange === 'No'}
                                                                onClick={() => handleApplyRecommendation(rec)}
                                                                sx={{
                                                                    backgroundColor: rec.queryChange === 'No' ? 'grey' : '#EE3524',
                                                                    minWidth: '36px',
                                                                    height: '36px',
                                                                    borderRadius: '50%',
                                                                    padding: 0,
                                                                    color: '#fff',
                                                                    '&:hover': {
                                                                        backgroundColor: rec.queryChange === 'No' ? 'grey' : '#d6301c',
                                                                    },
                                                                }}
                                                            >
                                                                <InfoOutlinedIcon fontSize="small" />
                                                            </StyledButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {emptyRows > 0 && (
                                                    <TableRow style={{ height: 53 * emptyRows }}>
                                                        <TableCell colSpan={10} />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Box>

                            {/* Pagination */}
                            <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
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


            {/* Snackbar and Dialog */}
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
                                    <Typography variant="body1" color="error" fontWeight="bold">Sample Query:</Typography>
                                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }} fontFamily="monospace">
                                        {currentRecommendation.previousQuery}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginTop: '16px' }} color="success" fontWeight="bold">Recommendation:</Typography>
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