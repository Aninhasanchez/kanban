import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coluna } from './Coluna';
import { DndContext } from '@dnd-kit/core';//biblioteca que permite fazer o clicar e arrastar

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        const apiUrl = 'http://127.0.0.1:8000/tarefa/';
        axios.get(apiUrl)
            .then(response => {
                setTarefas(response.data);
            })
            .catch(error => {
                console.error("Houve um erro ao buscar os dados da API:", error);
            });
    }, []);

    //Aqui vamos colocar mais uma logica para que se possa fazer a atualização dos cards
    function handleDragEnd(event) {
        const { active, over } = event;

        if (over && active) {
            const tarefaId = active.id;
            const novaColuna = over.id; // A coluna onde a tarefa foi solta

            setTarefas(prev =>
                prev.map(tarefa =>
                    tarefa.id === tarefaId ? { ...tarefa, status: novaColuna } : tarefa
                )
            );

            // Atualiza no backend também
            axios.patch(`http://127.0.0.1:8000/tarefa/${tarefaId}/`, {
                status: novaColuna
            }).catch(err => console.error("Erro ao atualizar status:", err));
        }
    }
  

    const tarefasAFazer = tarefas.filter(tarefa => tarefa.status === 'A fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'Fazendo');
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === 'Pronto');

    return (
        <>
            <h1>Meu Quadro</h1>
            {/* Informando qual é o campo que será possivel mover */}
            <DndContext onDragEnd={handleDragEnd}>
                <main className="conteiner">
                    {/* //as colunas também vai precisar de um id */}
                    <section className="atividades">
                        <Coluna id="A fazer" titulo="A fazer" tarefas={tarefasAFazer} />
                        <Coluna id="Fazendo" titulo="Fazendo" tarefas={tarefasFazendo} />
                        <Coluna id="Pronto" titulo="Pronto" tarefas={tarefasPronto} />
                    </section>
                </main>
            </DndContext>
        </>
    );
}