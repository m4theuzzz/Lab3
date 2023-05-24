import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import BasicCard from "../components/Card";
import Modal from "../components/Modal";
import NavBar from "../components/NavBar";
import { useForm } from "../hooks/useForm";
import useModal from "../hooks/useModal";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";

const defaultBeneficioValues = {
  description: "",
  value: 0,
  photo: "",
};

const Beneficios = () => {
  const [beneficios, setBeneficios] = useState([]);
  const [myBeneficios, setMyBeneficios] = useState([]);

  const [value, setValue] = useState("1");

  const role = useMemo(() => window.localStorage.getItem("role"), []);
  const [currentBalance, setCurrentBalance] = useState("");

  const { values, handleChange, setValues } = useForm(
    defaultBeneficioValues,
    {}
  );



  const getBalance = async () => {
    const res = await axios
      .get(
        "http://localhost:3000/" +
        role +
        "s" +
        `?user_id=${window.localStorage.getItem("userId")}`,
        {
          headers: {
            "session-token": window.localStorage.getItem("apiKey"),
          },
        }
      )
      .then((res) => res.data);

    setCurrentBalance(res[0].balance);
  };

  const beneficioModal = useModal();
  const beneficioBuyModal = useModal();

  const handleOpenEdit = (beneficio) => {
    setValues(beneficio);
    beneficioModal.open(true);
  };

  const handleOpenBuy = (beneficio) => {
    setValues(beneficio);
    beneficioBuyModal.open(true);
  };

  const handleBuyBeneficio = async (valuesBeneficio) => {
    try {
      await axios
        .post(
          "http://localhost:3000/beneficts/buy",
          { value: valuesBeneficio.value, benefict_id: valuesBeneficio.id },
          {
            headers: {
              "session-token": window.localStorage.getItem("apiKey"),
            },
          }
        )
        .then((res) => res.data);

      getBalance();
      getBeneficios();
      getMyBeneficios();
      beneficioBuyModal.open(false);
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteBeneficio = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/beneficts?id=${id}`, {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      });

      getBeneficios();
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  const handleFileInput = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      handleChange("photo")(reader.result);
    };
  };

  const handleAddBeneficio = async () => {
    const isEdit = !!values.id;

    try {
      if (isEdit) {
        const res = await axios
          .put(`http://localhost:3000/beneficts?id=${values.id}`, values, {
            headers: {
              "session-token": window.localStorage.getItem("apiKey"),
            },
          })
          .then((res) => res.data);
      } else {
        const res = await axios
          .post("http://localhost:3000/beneficts", values, {
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
      .get("http://localhost:3000/beneficts", {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      })
      .then((res) => res.data);

    setBeneficios(res);
  };

  const getMyBeneficios = async () => {
    const res = await axios
      .get("http://localhost:3000/beneficts/bought", {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      })
      .then((res) => res.data);

    setMyBeneficios(res);
  };

  useEffect(() => {
    getBalance();
    getBeneficios();
    getMyBeneficios();
  }, []);

  return (
    <Grid>
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
            <input type="file" onChange={handleFileInput} />
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
      <Modal
        open={beneficioBuyModal.isOpen}
        close={() => {
          beneficioBuyModal.close();
          setValues(defaultBeneficioValues);
        }}
        title={"Comprar beneficio"}
      >
        Tem certeza que deseja comprar {values.description} por {values.value}{" "}
        moedas? Você possui {currentBalance} moedas.
        <Grid
          item
          sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}
          xs={12}
        >
          <Button onClick={beneficioBuyModal.close}>Cancelar</Button>
          <Button
            disabled={currentBalance < values.value}
            onClick={() => handleBuyBeneficio(values)}
          >
            Confirmar
          </Button>
        </Grid>
      </Modal>
      <NavBar pageName={"Benefícios"} />
      <TabContext value={value}></TabContext>
      <Grid container spacing={5} sx={{ p: 5 }}>
        <TabContext value={value}>
          <TabList orientation="horizontal" onChange={(a, e) => setValue(e)}>
            <Tab key={0} value={"1"} label={"Todos os benefícios"} />
            {role == "student" ? (
              <Tab key={1} value={"2"} label={"Meus benefícios"} />
            ) : null}
          </TabList>
          <TabPanel sx={{ width: "100%" }} key={0} value={"1"}>
            <Grid item xs={12}>
              {role != "student" ? (
                <Grid item xs={12}>
                  <Button onClick={beneficioModal.open} variant="contained">
                    Novo Benefício
                  </Button>
                </Grid>
              ) : null}

              {beneficios.map((beneficio: any) => (
                <Grid item>
                  <BasicCard
                    title={beneficio.id}
                    subtitle={`${beneficio.description} | ${beneficio.value}`}
                    img={beneficio.photo}
                    action={
                      role == "student"
                        ? () => handleOpenBuy(beneficio)
                        : () => handleOpenEdit(beneficio)
                    }
                    disabled={myBeneficios.map((bene: any) => bene.id).includes(beneficio.id)}
                    action2={() => handleDeleteBeneficio(beneficio.id)}
                    actionText={role == "student" ? "Comprar" : "Editar"}
                    action2Text={role == "student" ? " " : "Excluir"}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel sx={{ width: "100%" }} key={0} value={"2"}>
            {myBeneficios.map((beneficio: any) => (
              <Grid item>
                <BasicCard
                  title={beneficio.id}
                  subtitle={`${beneficio.description} | ${beneficio.value}`}
                  img={beneficio.photo}
                />
              </Grid>
            ))}
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Beneficios;
