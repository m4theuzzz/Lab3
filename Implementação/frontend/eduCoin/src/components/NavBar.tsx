import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ pageName }: any) => {

  const role = useMemo(() => window.localStorage.get('role'), [])

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
        {role == 'teacher' ? <Link to={"/partners"}>
          <Button
            sx={{
              color: "white",
              textDecoration: pageName == "Parceiros" ? "underline" : "",
            }}
          >
            Parceiros
          </Button>
        </Link> : null}
        {role == 'partner' ? <Link to={"/beneficios"}>
          <Button
            sx={{
              color: "white",
              textDecoration: pageName == "Benefícios" ? "underline" : "",
            }}
          >
            Benefícios
          </Button>
        </Link> : null}
        {role != 'partner' ? <Link to={"/transactions"}>
          <Button
            sx={{
              color: "white",
              textDecoration: pageName == "Transações" ? "underline" : "",
            }}
          >
            Transações
          </Button>
        </Link> : null}
        <Link to={"/login"}>
          <Button sx={{ color: "white" }}>Sair</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
