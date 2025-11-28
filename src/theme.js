import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A73E8",
    },
    secondary: {
      main: "#F9AA33",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
