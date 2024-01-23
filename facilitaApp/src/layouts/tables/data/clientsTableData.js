/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import ClientService from "services/client-service";




export default function data(clients, handlerGetClients) {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );


  const handleDeleteClient = (event, id) => {
    event.preventDefault();
    console.log("ID: ", id);
  
    ClientService.delete(id).then( response => {
        console.log("RESPONSE DELETE: ", response);
        if (response.status == "success"){
            handlerGetClients();
        }
    })
  };
  
 let rows = [];

 clients.map( client => {
    console.log("CLIENTE: ", client);
    let row = {
        client: <Author image={team2} name={client.name} email={client.email} />,
        phone: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                {client.phone}
            </MDTypography>
        ),
        coordx: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {client.coordx}
          </MDTypography>
        ),
        coordy: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {client.coordy}
          </MDTypography>
        ),
        delete: (
          <MDTypography component="a" href="#" onClick={(event) => handleDeleteClient(event, client.id)} variant="caption" color="text" fontWeight="medium">
            Excluir
          </MDTypography>
        ),
      };

      rows.push(row);

 });
  
  return {
    columns: [
      { Header: "cliente", accessor: "client", width: "45%", align: "left" },
      { Header: "telefone", accessor: "phone", align: "left" },
      { Header: "coord x", accessor: "coordx", align: "center" },
      { Header: "coord y", accessor: "coordy", align: "center" },
      { Header: "excluir", accessor: "delete", align: "center" },
    ],

    rows: rows,
  };
}
