import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Schema de validação
const schemaEditarTarefa = z.object({
  prioridade: z.enum(["Baixa", "Media", "Alta"], {
    errorMap: () => ({ message: "Escolha Baixa, Média ou Alta" }),
  }),
  status: z.enum(["A fazer", "Fazendo", "Pronto"], {
    errorMap: () => ({ message: "Escolha um status válido" }),
  }),
});

export function EditarTarefa() {
  const { id } = useParams(); // pega o ID da rota
  const navigate = useNavigate();

  const [tarefa, setTarefa] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schemaEditarTarefa),
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/tarefa/${id}/`)
      .then((res) => {
        console.log(res)
        setTarefa(res.data);
        reset({
          prioridade: res.data.prioridade,
          status: res.data.status,
        });
      })
      .catch((err) => console.error("Erro ao buscar tarefa:", err));
  }, [id, reset]);

  // Função para salvar alterações
  async function salvarEdicao(data) {
    try {
      await axios.patch(`http://127.0.0.1:8000/tarefa/${id}/`, data);
      console.log(`Os dados do form${data}`)
      alert("Tarefa atualizada com sucesso!");
      navigate("/"); // volta para lista de tarefas
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err.response?.data || err);
      alert("Erro ao atualizar tarefa");
    }
  }

  if (!tarefa) return <p>Carregando...</p>;

  return (
    <section className="formulario">
      <h2>Editar de Tarefa</h2>
      <form onSubmit={handleSubmit(salvarEdicao)}>

        <label>Descrição:</label>
        <textarea value={tarefa.descricao} readOnly />

        <label>Setor:</label>
        <input type="text" value={tarefa.setor} readOnly />

        {/* <label>Usuário:</label>
        <input type="text" value={tarefa.usuario.nome} readOnly /> */}

        <label>Data de Cadastro:</label>
        <input type="text" value={tarefa.dt_cadastro} readOnly />

        <label>Prioridade:</label>
        <select {...register("prioridade")}>
          <option value="">Selecione</option>
          <option value="Baixa">Baixa</option>
          <option value="Media">Média</option>
          <option value="Alta">Alta</option>
        </select>
        {errors.prioridade && <p style={{ color: "red" }}>{errors.prioridade.message}</p>}

        <label>Status:</label>
        <select {...register("status")}>
          <option value="">Selecione</option>
          <option value="A fazer">A fazer</option>
          <option value="Fazendo">Fazendo</option>
          <option value="Pronto">Pronto</option>
        </select>
        {errors.status && <p style={{ color: "red" }}>{errors.status.message}</p>}


        <button type="submit">Editar</button>
      </form>
    </section>
  );
}
