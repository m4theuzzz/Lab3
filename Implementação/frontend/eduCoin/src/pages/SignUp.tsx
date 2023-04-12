import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { useForm } from "../hooks/useForm";

const defaultValues = {
  name: "",
  email: "",
  password: "",
};
const SignUp = () => {
  const { values, handleChange } = useForm(defaultValues, {});

  const handleSignUp = async () => {
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
          label="Nome"
          value={values.name}
          onChange={handleChange("name")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          value={values.email}
          onChange={handleChange("email")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Senha"
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleSignUp} variant="contained" fullWidth>
          Cadastrar
        </Button>
      </Grid>
     
    </Grid>
  );
};

export default SignUp;
