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

const carsmock = [1, 2, 3, 45, 6];

const Requests = () => {
  const [requests, setRequests] = useState([]);

  const rentModal = useModal();

  const handleDeleteRent = async () => {};

  useEffect(() => {
    const getRequests = async () => {
      axios.get();

      setRequests();
    };

    getRequests();
  }, []);

  return (
    <Grid>
      <NavBar pageName={"Pedidos de Aluguel"} />
      <Grid container spacing={5} sx={{ p: 5 }}>
        <Modal
          open={rentModal.isOpen}
          close={rentModal.close}
          title={"Fazer pedido de aluguel"}
        >
          Tem certeza que deseja apagar
          {rentModal.elementClicked.id} ?
          <Button onClick={rentModal.close}>Cancelar</Button>
          <Button onClick={handleDeleteRent}>Confirmar</Button>
        </Modal>
        {carsmock.map((rent: any) => (
          <Grid item>
            <BasicCard
              title={rent.id}
              subtitle={rent.status}
              action={() => rentModal.open(rent)}
              actionText={"Excluir"}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Requests;
