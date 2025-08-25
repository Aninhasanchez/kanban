export function CadUsuario(){
    return(
        <form>
            <h2>Cadastro de Usuáeio</h2>
            <label>Nome:</label>
            <input type="text" placeholder="José da Silva"></input>

            <label>Email: </label>
            <input type="email" placeholder="email@email.com"></input>

            <button type="submit">Cadastrar</button>

        </form>
    )
}