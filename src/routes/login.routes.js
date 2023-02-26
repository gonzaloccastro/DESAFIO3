import { Router } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import  {ProductFileManager} from "../dao/classes/DbManager.js";


const router = Router();
const productFileManager = new ProductFileManager();


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
      const user = await userModel.findOne({email: email,password: password,});
      if (!user) {
        return res.status(500).json({message: 'User not found'})
      }
      user['password'] = undefined;
      req.session.user = user;

      res.status(200).redirect('/products');
    } catch (err) {
    res.status(500).json({ message: err.message })}

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