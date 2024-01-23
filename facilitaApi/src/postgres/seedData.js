import { pool } from "../postgres/index.js"

export const createTableUsers = () => {
  pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  (error, results) => {
    if (error) {
      console.log(error);
    }
    else{
      console.log("TABELA USUÁRIOS CRIADA COM SUCESSO;");
    }
    return;
  })
}


export const dropTableClients = () => {
  pool.query(`DO $$ BEGIN
              IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
                EXECUTE 'DROP TABLE clients';
              END IF;
            END $$;`,
  (error, results) => {
    if (error) {
      console.log(error);
    }
    else{
      console.log("TABELA CLIENTES EXCLUIDA COM SUCESSO;");
    }
    return;
  })
}


export const createTableClients = () => {
  pool.query(`DO $$ BEGIN
              IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
                EXECUTE 'DROP TABLE clients';
              END IF;
              CREATE TABLE IF NOT EXISTS clients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telefone varchar(255) NULL,
                coordx INT NULL,
                coordy INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            END $$;`,
  (error, results) => {
    if (error) {
      console.log(error);
    }
    else{
      console.log("TABELA CLIENTES CRIADA COM SUCESSO;");
    }
    return;
  })
}

createTableClients();
createTableUsers();