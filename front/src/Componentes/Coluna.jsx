import { Tarefa } from './Tarefa';
import { useDroppable } from '@dnd-kit/core';


export function Coluna({ id, titulo, tarefas = [] }) {
      const { setNodeRef } = useDroppable({ id });

  return (
    <section className="coluna" ref={setNodeRef}>
      <h2>{titulo}</h2>
      {tarefas.map(tarefa => {
        console.log("Renderizando:", tarefa);
        return <Tarefa key={tarefa.id} tarefa={tarefa} />;
      })}
    </section>
  );
}