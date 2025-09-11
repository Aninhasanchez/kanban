import { Routes, Route } from "react-router-dom";
import { CadastroTarefa } from "../Paginas/CadastroTarefa";
import { CadastroUsuario } from "../Paginas/CadastroUsuario";
import { Quadro } from '../Componentes/Quadro';
import { Inicial} from '../Paginas/Inicial';
import { EditarTarefa } from "../Paginas/EditarTarefa";


export function Rotas() {
    return (
        <Routes>            
            <Route path="/" element={<Inicial />} >
                <Route index element={<Quadro />} /> 
                <Route path='cadTarefas' element={<CadastroTarefa/>}/> 
                <Route path='cadUsuario' element={<CadastroUsuario/>}/>       

                <Route path="editar/:id" element={<EditarTarefa />} />                      
            </Route>
        </Routes>
    );
}