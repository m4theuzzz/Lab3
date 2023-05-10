import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ pageName }: any) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <strong>EduCoin - </strong> {pageName}
        </Typography>
        <Link to={"/"}>
          <Button
            sx={{
              color: "white",
              textDecoration: pageName == "Alunos" ? "underline" : "",
            }}
          >
            Alunos
          </Button>
        </Link>
        <Link to={"/partners"}>
          <Button
            sx={{
              color: "white",
              textDecoration: pageName == "Parceiros" ? "underline" : "",
            }}
          >
            Parceiros
          </Button>
        </Link>
        <Link to={"/transactions"}>
          <Button
            sx={{
              color: "white",
              textDecoration: pageName == "Transações" ? "underline" : "",
            }}
          >
            Transações
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
