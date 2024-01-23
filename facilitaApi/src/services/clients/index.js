import dotenv from "dotenv";
import nodemailer from "nodemailer";
import randomToken from "random-token";
import bcrypt from "bcrypt";
import { userModel } from "../../schemas/user.schema";
import jwt from 'jsonwebtoken';
import { pool } from "../../postgres/index.js"


dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});


const TABLE = 'clients'; //A tabela principal do serviço

export const clientsRouteHandler = async (req, res) => {
  

  let foundUser = false;

  try {
     foundUser = await pool.query('SELECT * FROM clients ORDER BY created_at DESC', []);
  } catch (err) {
     console.error(err);
     return res
      .status(400)
      .json({ message: "Error checking user." });
  } 

  if (foundUser.rows.length == 0) {
    return res.status(400).json({
      errors: [{ detail: "No Client Registered" }],
    });
  } else {

    foundUser = foundUser.rows;

    return res.json({
      status: "Success",
      clients: foundUser,
    });
    
  }
};




export const registerRouteHandler = async (req, res, name, email, phone, coordx, coordy) => {

  console.log("coordenadas: ", coordx, coordy);
  
  let foundUser = false;

  try {
     foundUser = await pool.query(`SELECT * FROM ${TABLE} WHERE email = $1::text`, [email]);
  } catch (err) {
     console.error(err);
     return res
      .status(400)
      .json({ message: "Error checking user." });
  } 
 

  if (foundUser.rows.length > 0) {
    return res.status(400).json({ message: "Email is already in use" });
  }


  let insertUser = false;
  try {
     insertUser = await pool.query(`INSERT INTO ${TABLE} (name, email, telefone, coordx, coordy)
                                          VALUES ($1::text, $2::text, $3::text, $4::int, $5::int)`,
                                          [name, email, phone, coordx, coordy]
                                        );
  } catch (err) {
    console.log("Error saving user: ", err);
     return res
      .status(400)
      .json({ message: "Error saving client." });
  } 
 
  let newUser = false;
  let findUser = false;

  if(insertUser){
    try {
       findUser = await pool.query(`SELECT * FROM ${TABLE} WHERE email = $1::text`, [email]);
    } catch (err) {
       console.error(err);
       return res
      .status(400)
      .json({ message: "Error getting client." });
    } 

  }

  if(findUser){
    newUser = findUser.rows[0];

    return res.status(200).json({
      status: 'success',
      user: newUser,
    });

  }

  return res
      .status(400)
      .json({ message: "Error getting  new client." });
  
};


export const deleteRouteHandler = async (req, res, id) => {

  console.log("CHEGOU ID: ", id);

  let foundUser = false;

  try {
     foundUser = await pool.query(`SELECT * FROM ${TABLE} WHERE id = $1::int`, [id]);
  } catch (err) {
     console.error(err);
     return res
      .status(400)
      .json({ message: "Error checking user." });
  } 

  if (foundUser.rows.length == 0) {
    return res.status(400).json({
      errors: [{ detail: "Credentials don't match any existing users" }],
    });
  } else {
    
    try {
      foundUser = await pool.query(`DELETE FROM ${TABLE} WHERE id = $1::int`, [id]);
    } catch (err) {
       console.error(err);
       return res
        .status(400)
        .json({ message: "Error deleting user." });
    } 


    return res.status(200).json({
      status: 'success',
      message: 'client deleted',
    });
  }
};




export const resetPasswordRouteHandler = async (req, res) => {
  let foundUser = false;

  try {
     foundUser = await pool.query('SELECT * FROM users WHERE email = $1::text', [email]);
  } catch (err) {
     console.error(err);
     return res
      .status(400)
      .json({ message: "Error checking user." });
  } 

  if (foundUser.rows.length == 0) {
    return res.status(400).json({
      errors: [{ detail: "Credentials don't match any existing users" }],
    });
  } else {
    const { password, password_confirmation } = req.body.data.attributes;
    // validate password
    if (password.length < 8) {
      return res.status(400).json({
        errors: {
          password: ["The password should have at lest 8 characters."],
        },
      });
    }

    if (password != password_confirmation) {
      return res.status(400).json({
        errors: {
          password: ["The password and password confirmation must match."],
        },
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await userModel.updateOne(
      { email: foundUser.email },
      { $set: { "password": hashPassword } }
    );
    return res.sendStatus(204);
  }
};
