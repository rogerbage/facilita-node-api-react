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


import { useContext, useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Checkbox from "@mui/material/Checkbox";
import MDButton from "components/MDButton";
import { Link } from "react-router-dom";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { NoEncryption } from "@mui/icons-material";

import { InputLabel } from "@mui/material";

import AuthService from "services/auth-service";

import ClientService from "services/client-service";

import DataTable from "examples/Tables/DataTable";

// Data
import clientsTableData from "layouts/tables/data/clientsTableData";

import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";


async function getClients(){
  let resp  = await ClientService.clients();
  return resp;
}







function Dashboard() {

  const data = { page: 0, offset: 0 };

 
  
  const { columns: pColumns, rows: pRows } = projectsTableData();
  // const clientData = clientsTableData();


  const [clientData, setClientData] = useState({
    columns: [],
    rows: [],
  });

  const [clientsInfo, setClientsInfo] = useState({
      clients: [],
  });

  
  
const handlerGetClients = () => {
    getClients().then( response => {
      let clientD = clientsTableData(response.clients, handlerGetClients);
      setClientData({
        columns: clientD.columns,
        rows: clientD.rows,
      });
      console.log("ENVIOU CLIENTS: ", response.clients)      
      
      setClientsInfo({
        clients: response.clients,
      });
    });
  }

  useEffect(() => {
    handlerGetClients();
  }, [])
  

  const { sales, tasks } = reportsLineChartData;


  // const [clientData, setClientData] = useState({
  //   columns: "",
  //   rows: "",
  // });

  let randomx =  Math.floor(Math.random() * 100);
  let randomy = Math.floor(Math.random() * 100);

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    coordx: randomx,
    coordy: randomy,
  });

  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    eixoError: false,
    agreeError: false,
    error: false,
    errorText: "",
  });

  // ClientService.clients().then( response => {
  //   console.log(response);
  //   setClientData(clientsTableData());
  // });

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true });
      return;
    }

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    // if (inputs.password.trim().length < 8) {
    //   setErrors({ ...errors, passwordError: true });
    //   return;
    // }

    // if (inputs.agree === false) {
    //   setErrors({ ...errors, agreeError: true });
    //   return;
    // }

    // here will be the post action to add a user to the db
    const newUser = { name: inputs.name, email: inputs.email, phone: inputs.phone, coordx: inputs.coordx, coordy: inputs.coordy };

    const myData = {
      data: {
        type: "users",
        attributes: { ...newUser },
        relationships: {
          roles: {
            data: [
              {
                type: "roles",
                id: "1",
              },
            ],
          },
        },
      },
    };

    try {
      const response = await ClientService.register(myData);
      // authContext.login(response.access_token, response.refresh_token);

      handlerGetClients(setClientData);

      let randomx =  Math.floor(Math.random() * 100);
      let randomy = Math.floor(Math.random() * 100);


      setInputs({
        name: "",
        email: "",
        phone: "",
        coordx: randomx,
        coordy: randomy,
      });

      setErrors({
        nameError: false,
        emailError: false,
        phoneError: false,
        eixoError: false,
        error: false,
        errorText: "",
      });
    } catch (err) {
      setErrors({ ...errors, error: true, errorText: err.message });
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <MDBox py={3} >
        
        <Card style={{ padding: "10px"}}>
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                name="name"
                value={inputs.name}
                onChange={changeHandler}
                error={errors.nameError}
                inputProps={{
                  autoComplete: "name",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.nameError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  The name can not be empty
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={inputs.email}
                name="email"
                onChange={changeHandler}
                error={errors.emailError}
                inputProps={{
                  autoComplete: "email",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.emailError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  The email must be valid
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Telefone"
                variant="standard"
                fullWidth
                name="phone"
                value={inputs.phone}
                onChange={changeHandler}
                error={errors.phoneError}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Eixo X"
                variant="standard"
                fullWidth
                name="coordx"
                value={inputs.coordx}
                onChange={changeHandler}
                error={errors.eixoError}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Eixo Y"
                variant="standard"
                fullWidth
                name="coordy"
                value={inputs.coordy}
                onChange={changeHandler}
                error={errors.eixoError}
              />
            </MDBox>

            {errors.error && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {errors.errorText}
              </MDTypography>
            )}
            
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Registrar Cliente
              </MDButton>
            </MDBox>
           
          </MDBox>
        </Card>

        

        <MDBox style={{ marginTop: '50px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
            {clientData? (
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Lista de Clientes
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={clientData}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            ):
            (
              <MDTypography variant="h6" color="white">
                  Carregando
                </MDTypography>
            )
            }
            

            </Grid>
            <Grid item xs={12} md={6} lg={4}>
            {clientsInfo? (
              <OrdersOverview
                clients={clientsInfo.clients}
              />
            ): (
              <MDTypography variant="h6" color="white">
                  Carregando
                </MDTypography>
            )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
