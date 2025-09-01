import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho"
import { Outlet } from "react-router-dom";

export function Inicial (){
    return(
        <>
          <BarraNavegacao />
          <Cabecalho />
          <Outlet/>         
        </>
    )

}