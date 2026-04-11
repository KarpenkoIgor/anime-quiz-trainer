'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0B0205', 
    },
    secondary: {
      main: '#2C1B47',
    },
    error: { main: '#D32F2F' },
    warning: { main: '#ED6C02' },
    info: { main: '#0288D1' },
    success: { main: '#2E7D32' },
    background: {
      default: '#724C9D',
    },
    text: {
      primary: '#DCCAE9',
      secondary: '#9356A0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#DCCAE9',
        },
      },
    },
  },
},
);

export default function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}