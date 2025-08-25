import { useForm } from "react-hook-form";
import {z} from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";

const schemaCadUsuario = z.object({
    nome: z.string()
    .min(1, 'Informe seu nome, com pelo menos 1 caractere')
    .max(50, 'Informe no máximo ')
})

export function CadUsuario(){
    const{
        register,
        handleSubmit,
        formState: {errors}, reset
    } = useForm({
        resolver:zodResolver(schemaCadUsuario)
    });

    async function obterDados(data) {
        console.log
        
    }



    return(
        <form>
            <h2>Cadastro de Usuáeio</h2>
            <label>Nome:</label>
            <input type="text" placeholder="José da Silva" required {...register("nome")}></input>
            {errors.nome&& <p>{errors.nome.message}</p>}

            <label>Email: </label>
            <input type="email" placeholder="email@email.com" ></input>
            {errors.email&& <p>{errors.email.message}</p>}

            <button type="submit">Cadastrar</button>

        </form>
    )
}