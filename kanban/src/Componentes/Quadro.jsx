import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coluna } from './Coluna';
import { DndContext } from '@dnd-kit/core'; // biblioteca para drag and drop acessível

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    // Buscar tarefas da API ao carregar o componente
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

    // Função chamada quando o usuário termina um drag
    function handleDragEnd(event) {
        const { active, over } = event;

        if (over && active) {
            const tarefaId = active.id;
            const novaColuna = over.id; // Coluna destino

            // Atualiza no estado local
            setTarefas(prev =>
                prev.map(tarefa =>
                    tarefa.id === tarefaId ? { ...tarefa, status: novaColuna } : tarefa
                )
            );

            // Atualiza também no backend
            axios.patch(`http://127.0.0.1:8000/tarefa/${tarefaId}/`, {
                status: novaColuna
            }).catch(err => console.error("Erro ao atualizar status:", err));
        }
    }

    // Filtra as tarefas por status
    const tarefasAFazer = tarefas.filter(tarefa => tarefa.status === 'A fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'Fazendo');
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === 'Pronto');

    return (
        <div role="application" aria-label="Quadro Kanban de tarefas">
            <h1 tabIndex={0}>Meu Quadro</h1>
            {/* DndContext habilita o arrastar/soltar em todo o board */}
            <DndContext onDragEnd={handleDragEnd}>
                <main className="conteiner">
                    <section className="atividades" role="region" aria-label="Colunas do quadro Kanban">
                        {/* Cada Coluna é uma dropzone acessível */}
                        <Coluna
                            id="A fazer"
                            titulo="A fazer"
                            tarefas={tarefasAFazer}
                            ariaLabel="Coluna A fazer, tarefas pendentes"
                        />
                        <Coluna
                            id="Fazendo"
                            titulo="Fazendo"
                            tarefas={tarefasFazendo}
                            ariaLabel="Coluna Fazendo, tarefas em andamento"
                        />
                        <Coluna
                            id="Pronto"
                            titulo="Pronto"
                            tarefas={tarefasPronto}
                            ariaLabel="Coluna Pronto, tarefas concluídas"
                        />
                    </section>
                </main>
            </DndContext>

            {/* Instruções para acessibilidade */}
            <p className="sr-only">
                Use o mouse para arrastar tarefas entre colunas ou use o teclado com Tab + Enter para navegar e mover.
            </p>
        </div>
    );
}
