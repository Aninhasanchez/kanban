 import { Link } from 'react-router-dom'


export function BarraNavegacao(){
    return(
        <nav className="barra">
            <ul>
                <li><Link to='/'>Gerenciamento de Tarefas</Link></li>
                <li><Link to='cadTarefas'>Cadastro de Tarefas</Link></li>
                <li><Link to='cadUsuario'>Cadastro de Usuário</Link></li>
            </ul>
        </nav>
    )
}