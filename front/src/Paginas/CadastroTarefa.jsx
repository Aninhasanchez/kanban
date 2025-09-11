import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../Styles/_cadastro.scss";

// Schema de validação
const schemaCadTarefa = z.object({
  descricao: z.string().min(1, "Informe uma descrição").max(100, "Informe no máximo 100 caracteres"),
  setor: z.string().min(1, "Informe um setor").max(50, "Informe no máximo 50 caracteres"),
  prioridade: z.enum(["Baixa", "Media", "Alta"], { errorMap: () => ({ message: "Escolha Baixa, Média ou Alta" }) }),
  usuario: z.string().min(1, "Selecione um usuário"),
});

export function CadastroTarefa() {
  const [usuarios, setUsuarios] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schemaCadTarefa),
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="cadastro-tarefa">
      <h2>Cadastro de Tarefa</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Descrição</label>
          <textarea {...register("descricao")} rows={3}></textarea>
          {errors.descricao && <p className="error">{errors.descricao.message}</p>}
        </div>

        <div>
          <label>Setor</label>
          <input type="text" {...register("setor")} />
          {errors.setor && <p className="error">{errors.setor.message}</p>}
        </div>

        <div>
          <label>Prioridade</label>
          <select {...register("prioridade")}>
            <option value="">Selecione</option>
            <option value="Baixa">Baixa</option>
            <option value="Media">Média</option>
            <option value="Alta">Alta</option>
          </select>
          {errors.prioridade && <p className="error">{errors.prioridade.message}</p>}
        </div>

        <div>
          <label>Usuário</label>
          <select {...register("usuario")}>
            <option value="">Selecione</option>
            {usuarios.map((u, i) => <option key={i} value={u}>{u}</option>)}
          </select>
          {errors.usuario && <p className="error">{errors.usuario.message}</p>}
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
