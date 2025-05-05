// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // your custom primary color
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ba1110', // your custom secondary color
      contrastText: '#db0011'
    },
    background: {
      default: '#F5F5F5',
    }
  },
  components: {
    MuiLoadingButton: { // ✅ Target LoadingButton directly
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#ba1110',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
