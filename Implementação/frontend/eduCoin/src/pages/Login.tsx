import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "../hooks/useForm";

const defaultValues = {
  email: "",
  password: "",
};

const Login = () => {
  const { values, handleChange } = useForm(defaultValues, {});

  const handleSignIn = async () => {
    axios.post();
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        width: 300,
        margin: "auto",
      }}
      xs={12}
      spacing={3}
    >
      <Grid item xs={12}>
        <TextField
          label="Email"
          fullWidth
          value={values.email}
          onChange={handleChange("email")}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={values.password}
          onChange={handleChange("password")}
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleSignIn} variant="contained" fullWidth>
          Entrar
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Link to="/signup">
          <Button variant="text" fullWidth>
            Criar conta
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default Login;
