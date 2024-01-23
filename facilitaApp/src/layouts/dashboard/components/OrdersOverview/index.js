/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

import ClientService from "services/client-service";


function calcularDistancia(ponto1, ponto2) {
  const diferencaX = ponto2.x - ponto1.x;
  const diferencaY = ponto2.y - ponto1.y;
  return Math.sqrt(diferencaX * diferencaX + diferencaY * diferencaY);
}

function caixeiroViajante(pontos) {
  const n = pontos.length;

  // Inicializar o caminho com o primeiro ponto
  const caminho = [0];
  let pontoAtual = 0;

  while (caminho.length < n) {
      let menorDistancia = Infinity;
      let proximoPonto = null;

      // Encontrar o ponto mais próximo não visitado
      for (let i = 0; i < n; i++) {
          if (!caminho.includes(i)) {
              const distancia = calcularDistancia(pontos[pontoAtual], pontos[i]);
              if (distancia < menorDistancia) {
                  menorDistancia = distancia;
                  proximoPonto = i;
              }
          }
      }

      // Adicionar o ponto mais próximo ao caminho
      caminho.push(proximoPonto);
      pontoAtual = proximoPonto;
  }

  // Adicionar o ponto de origem ao final do caminho
   caminho.push(0);

  return caminho;
}


function calcDistanceOrder(clients){

  let pontos = []; 

  clients.unshift({ name: "Sede da Empresa", coordx: 0, coordy: 0 });

  console.log(clients);

  clients.map( client => {
    let ponto = {
      x: client.coordx,
      y: client.coordy,
    }
    pontos.push(ponto);
  });
  // Exemplo de uso
// const pontos = [
//   { x: 0, y: 0 },
//   { x: 1, y: 2 },
//   { x: 2, y: 4 },
//   { x: 3, y: 1 },
// ];

const caminhoOtimo = caixeiroViajante(pontos);
console.log("Caminho ótimo:", caminhoOtimo);

let clientsOrder = [];


caminhoOtimo.map( index => {
  clientsOrder.push(clients[index]);
});



console.log("CLIENTSORDER: ", clientsOrder);

return clientsOrder;

}



function OrdersOverview(clients) {

  console.log("CHEGOU CLIENTS: ", clients);

  let rows = [];

  let clientsBase = clients.clients;

  let clientsOrder = calcDistanceOrder(clientsBase);


 clientsOrder.map( client => {
    console.log("CLIENTE: ", client);
    let coords = client.coordx +  " - " + client.coordy;
    let row = <TimelineItem
                color="success"
                icon="payment"
                title={client.name}
                dateTime={coords}
              />

      rows.push(row);
 });

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Melhor Trajeto
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {rows}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
