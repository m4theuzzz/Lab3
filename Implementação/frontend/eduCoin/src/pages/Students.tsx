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
import NavBar from "../components/NavBar";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";
import { useForm } from "../hooks/useForm";

const defaultStudentValues = {
  name: "",
  email: "",
  password: "",
  rg: "",
  school: "",
  course: "",
};

const carsmock = [1, 2, 3, 45, 6];

const Students = () => {
  const [students, setStudents] = useState([]);

  const { values, handleChange, setValues } = useForm(defaultStudentValues, {});

  const studentModal = useModal();

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete("");
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  const handleOpenEdit = (student) => {
    setValues(student);
    studentModal.open(true);
  };

  const handleAddStudent = async () => {
    const isEdit = !!studentModal.elementClicked;

    try {
      if (isEdit) {
        const res = await axios.post("", values).then((res) => res.data);
      } else {
        const res = await axios.put("", values).then((res) => res.data);
      }
    } catch (error) {
      alert("Erro: " + error);
    }
  };

  const getStudents = async () => {
    const res = await axios.get("").then((res) => res.data);

    setStudents(res);
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <Grid>
      <NavBar pageName={"Alunos"} />
      <Grid container spacing={5} sx={{ p: 5 }}>
        <Grid item xs={12}>
          <Button onClick={studentModal.open} variant="contained">
            Novo Aluno
          </Button>
        </Grid>
        <Modal
          open={studentModal.isOpen}
          close={studentModal.close}
          title={"Novo aluno"}
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
              <TextField
                label="RG"
                fullWidth
                value={values.rg}
                onChange={handleChange("rg")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Escola"
                fullWidth
                value={values.school}
                onChange={handleChange("school")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Curso"
                fullWidth
                value={values.course}
                onChange={handleChange("course")}
              />
            </Grid>
          </Grid>
          <Grid
            item
            sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}
            xs={12}
          >
            <Button onClick={studentModal.close}>Cancelar</Button>
            <Button onClick={handleAddStudent}>Confirmar</Button>
          </Grid>
        </Modal>
        {carsmock.map((student: any) => (
          <Grid item>
            <BasicCard
              title={student.model}
              subtitle={`${student.year} | ${student.brand}`}
              action={() => handleOpenEdit(student)}
              action2={() => handleDeleteStudent(student.id)}
              actionText={"Editar"}
              action2Text={"Excluir"}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Students;
