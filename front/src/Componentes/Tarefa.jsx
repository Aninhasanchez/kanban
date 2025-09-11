import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
//usando a biblioteca
import { useDraggable } from "@dnd-kit/core";


export function Tarefa({ tarefa }) {
    const navigate = useNavigate();
    const [status, setStatus] = useState(tarefa.status || "");


    //inserindo o uso da biblioteca
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: tarefa.id,
    });
    //emitir o efeito de arrastar
    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined;



    async function excluirTarefa(id) {
        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/tarefa/${id}/`);
                alert("Tarefa excluída com sucesso!");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao excluir tarefa:", error);
                alert("Erro ao excluir tarefa.");
            }
        }
    }

    async function alterarStatus() {
        try {
            await axios.patch(`http://127.0.0.1:8000/tarefa/${tarefa.id}/`, {
                status: status,
            });
            alert("Status alterado com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status.");
        }
    }
    return (
        <article
            ref={setNodeRef} style={style}{...listeners}{...attributes}
            className="tarefa" >
            <header>
                <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao}</h3>
            </header>
            <dl>
                <dt>Setor:</dt><dd>{tarefa.setor}</dd>
                <dt>Prioridade:</dt><dd>{tarefa.prioridade}</dd>
            </dl>

            <div className="tarefa__acoes">
                <button type="button" onClick={() => navigate(`/editar/${tarefa.id}`)}>Editar</button>
                <button type="button" onClick={() => excluirTarefa(tarefa.id)}>Excluir</button></div>

            <div className="tarefa__status">
                <label>Status:</label>
                <select
                    id={`status-${tarefa.id}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Selecione</option>
                    <option value="A fazer">A fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Pronto">Pronto</option>
                </select>
                <button type="button" onClick={alterarStatus}>
                    Alterar Status
                </button>
            </div>
        </article>
    );
}