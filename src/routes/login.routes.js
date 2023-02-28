import { Router } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import  {ProductFileManager} from "../dao/classes/DbManager.js";
import { isValidPassword } from "../utils.js";



const router = Router();

router.get("/", async (req, res) => {
  const { email, password } = req.query;
  try {
    if(!email || !password){
      res.render("login", {title: "Login" });
    }} catch (err) {
        res.status(500).send(err.message);
      }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).send({ status: "error", message: "Faltan datos" });
      return;
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res
        .status(404)
        .send({ status: "error", message: "Usuario no encontrado" });
      return;
    }
    const isValid = isValidPassword(password, user);
    console.log(isValid);

    if (!isValidPassword(password, user)) {
      res
        .status(401)
        .send({ status: "error", message: "Contraseña incorrecta" });
      return;
    }
    delete user.password;
    req.session.user = user;
    res.send({ status: "success", payload: user });
    return;
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const auth = async (req,res,next) => {
  console.log("auth", req.session.user);
  if (await req.session?.admin) {
    return next();
  } else {
    return res.status(401).send("error de autenticación");
  }
};

router.get("/perfil", auth, async (req,res) => {

  if (await req.session?.admin) {
    console.log("Has entrado");
    const userData = await userModel.findOne({email:req.session.user})
    console.log("userData", userData);
    const {first_name} = userData;
    res.render("perfil",userData);
  }
});

export default router;