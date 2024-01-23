import dotenv from "dotenv";
import nodemailer from "nodemailer";
import randomToken from "random-token";
import bcrypt from "bcrypt";
import { userModel } from "../../schemas/user.schema";
import jwt from 'jsonwebtoken';
import { pool } from "../../postgres/index.js"


dotenv.config();

const TABLE = 'users';

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export const loginRouteHandler = async (req, res, email, password) => {
  

  let foundUser = false;

  try {
     foundUser = await pool.query(`SELECT * FROM ${TABLE} WHERE email = $1::text`, [email]);
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

    foundUser = foundUser.rows[0];

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (validPassword) {
      // Generate JWT token
      const token = jwt.sign(
        { id: foundUser.id, email: foundUser.email },
        "token",
        {
          expiresIn: "24h",
        }
      );
      return res.json({
        token_type: "Bearer",
        expires_in: "24h",
        access_token: token,
        refresh_token: token,
      });
    } else {
      return res.status(400).json({
        errors: [{ detail: "Invalid password" }],
      });
    }
  }
};




export const registerRouteHandler = async (req, res, name, email, password) => {
  
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


  if (!password || password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }

  
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  let insertUser = false;
  try {
     insertUser = await pool.query(`INSERT INTO ${TABLE} (name, email, password)
                                          VALUES ($1::text, $2::text, $3::text)`,
                                          [name, email, hashPassword]
                                        );
  } catch (err) {
    console.log("Error saving user: ", err);
     return res
      .status(400)
      .json({ message: "Error saving user." });
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
      .json({ message: "Error getting user." });
    } 

  }

  if(findUser){
    newUser = findUser.rows[0];

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, "token", {
      expiresIn: "24h",
    });
    return res.status(200).json({
      token_type: "Bearer",
      expires_in: "24h",
      access_token: token,
      refresh_token: token,
    });

  }

  return res
      .status(400)
      .json({ message: "Error getting  new user." });
  
};


export const forgotPasswordRouteHandler = async (req, res, email) => {

  
  let foundUser = false;

  try {
     foundUser = await pool.query(`SELECT * FROM ${TABLE} WHERE email = $1::text`, [email]);
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
    let token = randomToken(20);
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "admin@jsonapi.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      html: `<p>You requested to change your password.If this request was not made by you please contact us. Access <a href='${process.env.APP_URL_CLIENT}/auth/reset-password?token=${token}&email=${email}'>this link</a> to reste your password </p>`, // html body
    });
    const dataSent = {
      data: "password-forgot",
      attributes: {
        redirect_url: `${process.env.APP_URL_API}/password-reset`,
        email: email,
      },
    };
    return res.status(204).json(dataSent);
  }
};




// export const loginRouteHandler = async (req, res, email, password) => {
//   //Check If User Exists
//   let foundUser = await userModel.findOne({ email: email });
//   if (foundUser == null) {
//     return res.status(400).json({
//       errors: [{ detail: "Credentials don't match any existing users" }],
//     });
//   } else {
//     const validPassword = await bcrypt.compare(password, foundUser.password);
//     if (validPassword) {
//       // Generate JWT token
//       const token = jwt.sign(
//         { id: foundUser.id, email: foundUser.email },
//         "token",
//         {
//           expiresIn: "24h",
//         }
//       );
//       return res.json({
//         token_type: "Bearer",
//         expires_in: "24h",
//         access_token: token,
//         refresh_token: token,
//       });
//     } else {
//       return res.status(400).json({
//         errors: [{ detail: "Invalid password" }],
//       });
//     }
//   }
// };

// export const registerRouteHandler = async (req, res, name, email, password) => {
//   // check if user already exists
//   let foundUser = await userModel.findOne({ email: email });
//   if (foundUser) {
//     // does not get the error
//     return res.status(400).json({ message: "Email is already in use" });
//   }

//   // check password to exist and be at least 8 characters long
//   if (!password || password.length < 8) {
//     return res
//       .status(400)
//       .json({ message: "Password must be at least 8 characters long." });
//   }

//   // hash password to save in db
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(password, salt);

//   const newUser = new userModel({
//     name: name,
//     email: email,
//     password: hashPassword,
//   });
//   await newUser.save();

//   // Generate JWT token
//   const token = jwt.sign({ id: newUser.id, email: newUser.email }, "token", {
//     expiresIn: "24h",
//   });
//   return res.status(200).json({
//     token_type: "Bearer",
//     expires_in: "24h",
//     access_token: token,
//     refresh_token: token,
//   });
// };

// export const forgotPasswordRouteHandler = async (req, res, email) => {
//   let foundUser = await userModel.findOne({ email: email });

//   if (!foundUser) {
//     return res.status(400).json({
//       errors: { email: ["The email does not match any existing user."] },
//     });
//   } else {
//     let token = randomToken(20);
//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: "admin@jsonapi.com", // sender address
//       to: email, // list of receivers
//       subject: "Reset Password", // Subject line
//       html: `<p>You requested to change your password.If this request was not made by you please contact us. Access <a href='${process.env.APP_URL_CLIENT}/auth/reset-password?token=${token}&email=${email}'>this link</a> to reste your password </p>`, // html body
//     });
//     const dataSent = {
//       data: "password-forgot",
//       attributes: {
//         redirect_url: `${process.env.APP_URL_API}/password-reset`,
//         email: email,
//       },
//     };
//     return res.status(204).json(dataSent);
//   }
// };

export const resetPasswordRouteHandler = async (req, res) => {
  let foundUser = false;

  try {
     foundUser = await pool.query(`SELECT * FROM ${TABLE} WHERE email = $1::text`, [email]);
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
