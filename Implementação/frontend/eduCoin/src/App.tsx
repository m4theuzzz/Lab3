import { useState } from "react";

import "./App.css";
import { Grid } from "@mui/material";
import AppRoutes from "./routes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Grid
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "lightblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppRoutes />
    </Grid>
  );
}

export default App;
