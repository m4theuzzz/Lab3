import { Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BasicCard from "../components/Card";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import { useForm } from "../hooks/useForm";
import useModal from "../hooks/useModal";

const defaultBeneficioValues = {
  description: "",
  value: 0
};

const Beneficios = () => {
  const [beneficios, setBeneficios] = useState([]);

  const { values, handleChange, setValues } = useForm(
    defaultBeneficioValues,
    {}
  );

  const beneficioModal = useModal();

  const handleOpenEdit = (beneficio) => {
    setValues(beneficio);
    beneficioModal.open(true);
  };

  const handleDeleteBeneficio = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/partners?id=${id}`, {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      });

      getBeneficios();
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  const handleAddBeneficio = async () => {
    const isEdit = !!values.id;

    try {
      if (isEdit) {
        const res = await axios
          .put(`http://localhost:3000/partners?id=${values.id}`, values, {
            headers: {
              "session-token": window.localStorage.getItem("apiKey"),
            },
          })
          .then((res) => res.data);
      } else {
        const res = await axios
          .post("http://localhost:3000/partners", values, {
            headers: {
              "session-token": window.localStorage.getItem("apiKey"),
            },
          })
          .then((res) => res.data);
      }
      beneficioModal.close();
      getBeneficios();
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  const getBeneficios = async () => {
    const res = await axios
      .get("http://localhost:3000/partners", {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      })
      .then((res) => res.data);

    setBeneficios(res);
  };

  useEffect(() => {
    getBeneficios();
  }, []);

  return (
    <Grid>
      <NavBar pageName={"Benefícios"} />
      <Grid container spacing={5} sx={{ p: 5 }}>
        <Grid item xs={12}>
          <Button onClick={beneficioModal.open} variant="contained">
            Novo Benefício
          </Button>
        </Grid>
        <Modal
          open={beneficioModal.isOpen}
          close={() => {
            beneficioModal.close();
            setValues(defaultBeneficioValues);
          }}
          title={"Novo beneficio"}
        >
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                fullWidth
                value={values.description}
                onChange={handleChange("description")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Valor"
                fullWidth
                type="number"
                value={values.value}
                onChange={handleChange("value")}
              />
            </Grid>
            <Grid item xs={12}>
                <Typography mb={2}>Foto</Typography>
             <input type="file" />
            </Grid>
          </Grid>
          <Grid
            item
            sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}
            xs={12}
          >
            <Button onClick={beneficioModal.close}>Cancelar</Button>
            <Button onClick={handleAddBeneficio}>Confirmar</Button>
          </Grid>
        </Modal>
        {beneficios.map((beneficio: any) => (
          <Grid item>
            <BasicCard
              title={beneficio.name}
              subtitle={`${beneficio.email} | ${beneficio.sector}`}
              action={() => handleOpenEdit(beneficio)}
              action2={() => handleDeleteBeneficio(beneficio.id)}
              actionText={"Editar"}
              action2Text={"Excluir"}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Beneficios;
