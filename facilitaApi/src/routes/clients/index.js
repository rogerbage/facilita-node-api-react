import express from "express";
import {
  deleteRouteHandler,
  clientsRouteHandler,
  registerRouteHandler,
  resetPasswordRouteHandler,
} from "../../services/clients";



const router = express.Router();


// router.get("/teste", async (req, res, next) => {
//   // const { email, password } = req.body.data.attributes;
//   await getUsers(req, res);
// });

router.post("/", async (req, res, next) => {
  //const { email, password } = req.body.data.attributes;
  await clientsRouteHandler(req, res);
});


router.post("/delete", async (req, res, next) => {
  console.log(req.body);
  const id  = req.body;
  await deleteRouteHandler(req, res, id);
});

router.post("/logout", (req, res) => {
  return res.sendStatus(204);
});

router.post("/register", async (req, res) => {
  const { name, email, phone, coordx, coordy } = req.body.data.attributes;
  await registerRouteHandler(req, res, name, email, phone, coordx, coordy);
});

router.post("/password-forgot", async (req, res) => {
  const { email } = req.body.data.attributes;
  await forgotPasswordRouteHandler(req, res, email);
});

router.post("/password-reset", async (req, res) => {
  await resetPasswordRouteHandler(req, res);
});

export default router;
