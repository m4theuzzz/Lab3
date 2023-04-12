import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ pageName }: any) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {pageName}
        </Typography>
        <Link to={"/"}>
          <Button
            sx={{
              color: "white",
              textDecoration:
                pageName == "Pedidos de Aluguel" ? "underline" : "",
            }}
          >
            Pedidos de Aluguel
          </Button>
        </Link>
        <Link to={"/cars"}>
          <Button
            sx={{
              color: "white",
              textDecoration: pageName == "Carros" ? "underline" : "",
            }}
          >
            Carros
          </Button>
        </Link>
        <Link to={"/login"}>
          <Button sx={{ color: "white" }}>Sair</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
