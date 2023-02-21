import { Router } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import  {ProductFileManager} from "../dao/classes/DbManager.js";

const productFileManager = new ProductFileManager();

const router = Router();

router.get("/", async (req, res) => {
  const { email, password } = req.query;

    if(!email || !password || req.session == null || req.session.admin == false || req.session.admin ==undefined){
      res.render("login", {title: "Login" });
    }
    else {
      try {
        const response = await userModel.find({
          email: email,
          password: password,
        }
        );
        console.log("prueba 2 login" , response);
        if (response.length > 0) {
          try {
            const products = await productFileManager.paginate({query: query || ""},{limit: parseInt(limit) || 10, page: parseInt(page) || 1, sort: parseInt(sort) || 1});
            const main = {
                title: "Productos",
                products: products.docs,
            };
            res.render("products", main,);
        } catch (error) {
            res.status(500).send(error.message);
        }
        } else {
          //alert("Usuario no encontrado");
          res.render("login", {title: "Login no encontrado" });
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
  } 
});

router.post("/", async (req, res) => {
    const { email, password } = req.body;

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