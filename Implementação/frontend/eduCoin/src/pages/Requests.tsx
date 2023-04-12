import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BasicCard from "../components/Card";
import NavBar from "../components/NavBar";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";



const Requests = () => {
 

  return (
    <Grid>
      <NavBar pageName={"Pedidos de Aluguel"} />
      <Grid container spacing={5} sx={{ p: 5 }}>
       EU AMO PROJETO DE SOFTWARE
      </Grid>
    </Grid>
  );
};

export default Requests;
