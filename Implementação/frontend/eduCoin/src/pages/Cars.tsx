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
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import useModal from "../hooks/useModal";

const carsmock = [1, 2, 3, 45, 6];

const Cars = () => {
  const [cars, setCars] = useState([]);

  const carModal = useModal();

  const handleRentCar = async () => {};
  const getCars = async () => {
    axios.get();

    setCars();
  };

  useEffect(() => {
    getCars();
  }, []);

  return (
    <Grid>
      <NavBar pageName={"Carros"} />
      <Grid container spacing={5} sx={{ p: 5 }}>
        <Modal
          open={carModal.isOpen}
          close={carModal.close}
          title={"Fazer pedido de aluguel"}
        >
          Tem certeza que deseja realizar um pedido para este carro?
          <Button onClick={carModal.close}>Cancelar</Button>
          <Button onClick={handleRentCar}>Confirmar</Button>
        </Modal>
        {carsmock.map((car: any) => (
          <Grid item>
            <BasicCard
              title={car.model}
              subtitle={`${car.year} | ${car.brand}`}
              action={() => carModal.open(car)}
              actionText={"Alugar"}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Cars;
