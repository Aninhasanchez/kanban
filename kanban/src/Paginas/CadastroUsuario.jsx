
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schemaCadUsuario = z.object({
  nome: z.string()
    .min(1, "Informe ao menos um valor")
    .max(50, "Informe no máximo 50 caracteres"), 
  email: z.string()
    .min(1, "Informe ao menos um valor")
    .max(50, "Informe até 50 caracteres")
    .email("Formato de email inválido"),
});

export function CadastroUsuario() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schemaCadUsuario) 
  });

  async function obterDados(data) {
    console.log('dados recebidos', data);
  }

  return (
    <section className="formulario">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit(obterDados)}>
        
        <label>Nome:</label>
        <input type="text" {...register("nome")} placeholder='Nome Sobrenome'/>
        {errors.nome && <p>{errors.nome.message}</p>}

        <label>Email:</label>
        <input type="email" {...register("email")} placeholder='email@dominio.com' />
        {errors.email && <p>{errors.email.message}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </section>
  );
}
