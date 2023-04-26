import {
  AppBar,
  Button,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BasicCard from "../components/Card";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import { useForm } from "../hooks/useForm";
import useModal from "../hooks/useModal";

const carsmock = [1, 2, 3, 45, 6];

const defaultPartnerValues = {
  name: "",
  email: "",
  password: "",
  sector: "",
};

const Parceiros = () => {
  const [partners, setPartners] = useState([]);

  const { values, handleChange, setValues } = useForm(defaultPartnerValues, {});

  const partnerModal = useModal();

  const handleOpenEdit = (partner) => {
    setValues(partner);
    partnerModal.open(true);
  };

  const handleDeletePartner = async (id) => {
    try {
      await axios.delete("xxxxx/" + id);

      getPartners();
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  const handleAddPartner = async () => {
    const isEdit = !!partnerModal.elementClicked;

    try {
      if (isEdit) {
        const res = await axios.post("", values).then((res) => res.data);
      } else {
        const res = await axios.put("", values).then((res) => res.data);
      }

      getPartners();
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  const getPartners = async () => {
    const res = await axios.get('').then((res) => res.data);

    setPartners(res);
  };

  useEffect(() => {
    getPartners();
  }, []);

  return (
    <Grid>
      <NavBar pageName={"Parceiros"} />
      <Grid container spacing={5} sx={{ p: 5 }}>
        <Grid item xs={12}>
          <Button onClick={partnerModal.open} variant="contained">
            Novo Parceiro
          </Button>
        </Grid>
        <Modal
          open={partnerModal.isOpen}
          close={partnerModal.close}
          title={"Novo parceiro"}
        >
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                label="Nome"
                fullWidth
                value={values.name}
                onChange={handleChange("name")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Setor"
                fullWidth
                value={values.sector}
                onChange={handleChange("sector")}
              />
            </Grid>
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
          </Grid>
          <Grid
            item
            sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}
            xs={12}
          >
            <Button onClick={partnerModal.close}>Cancelar</Button>
            <Button onClick={handleAddPartner}>Confirmar</Button>
          </Grid>
        </Modal>
        {carsmock.map((partner: any) => (
          <Grid item>
            <BasicCard
              title={partner.model}
              subtitle={`${partner.year} | ${partner.brand}`}
              action={() => handleOpenEdit(partner)}
              action2={() => handleDeletePartner(partner)}
              actionText={"Editar"}
              action2Text={"Excluir"}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Parceiros;
