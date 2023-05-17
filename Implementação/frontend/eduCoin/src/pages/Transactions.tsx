import { Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import { useForm } from "../hooks/useForm";
import Modal from "../components/Modal";
import useModal from "../hooks/useModal";
import BasicCard from "../components/Card";
import DropdownAsync from "../components/DropdownAsync";

const defaultTransactionValues = {
  type: "credit",
  value: "",
  description: "",
  origin: "",
  target: "",
};

const Transactions = () => {
  const { values, handleChange, setValues, handleChangeDropdownValue } =
    useForm(defaultTransactionValues, {});

  const transactionModal = useModal();

  const [currentBalance, setCurrentBalance] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState<any>([]);

  const role = useMemo(() => window.localStorage.getItem("role"), []);

  const getBalance = async () => {
    const res = await axios
      .get(
        "http://localhost:3000/teachers" +
        `?user_id=${window.localStorage.getItem("userId")}`,
        {
          headers: {
            "session-token": window.localStorage.getItem("apiKey"),
          },
        }
      )
      .then((res) => res.data);

    console.log(res);
    setCurrentBalance(res[0].balance);
  };

  const getTransactions = async () => {
    const res = await axios
      .get("http://localhost:3000/transactions", {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      })
      .then((res) => res.data);

    setTransactions(res);
  };

  const getStudents = async () => {
    const res = await axios
      .get("http://localhost:3000/students", {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      })
      .then((res) => res.data);

    setStudents(res);
  };

  const handleAddTransaction = async () => {
    try {
      const res = await axios
        .post("http://localhost:3000/transactions", values, {
          headers: {
            "session-token": window.localStorage.getItem("apiKey"),
          },
        })
        .then((res) => res.data);

      transactionModal.close();
      getTransactions();
      getBalance();
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  useEffect(() => {
    getBalance();
    getTransactions();
    getStudents();
  }, []);

  return (
    <Grid container xs={12}>
      <NavBar pageName={"Transações"} />
      <Grid container spacing={5} sx={{ p: 5 }}>
        {role != "student" ? (
          <Grid item xs={12}>
            <Button variant="contained" onClick={transactionModal.open}>
              Nova Transação
            </Button>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: "black" }}>
            Saldo atual: {currentBalance} moedas
          </Typography>
        </Grid>

        <Modal
          open={transactionModal.isOpen}
          close={() => {
            transactionModal.close();
            setValues(defaultTransactionValues);
          }}
          title={"Nova transferência"}
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
              <DropdownAsync
                label="Aluno"
                endpoint="/students"
                fullWidth
                valueKey={values.target}
                valueTag="id"
                onChange={handleChangeDropdownValue("target", "id")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Valor"
                type="number"
                fullWidth
                value={values.value}
                onChange={handleChange("value")}
              />
            </Grid>
          </Grid>
          <Grid
            item
            sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}
            xs={12}
          >
            <Button onClick={transactionModal.close}>Cancelar</Button>
            <Button onClick={handleAddTransaction}>Confirmar</Button>
          </Grid>
        </Modal>
        <Grid item xs={12}>
          {transactions.length
            ? transactions.map((transaction: any) => (
              <Grid item>
                <BasicCard
                  title={`R$ ${transaction.value}`}
                  subtitle={`${transaction.description} | para ${students.find(
                    (student: any) => student.id == transaction.target
                  )?.name
                    }`}
                />
              </Grid>
            ))
            : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Transactions;
