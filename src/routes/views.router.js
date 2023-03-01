import {Router} from "express";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";


const router = Router();

router.get("/", async (req, res) => {
  res.render("home");
});

router.get("/login", async (req, res) => {
    res.render("login");
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
/*

const router = express.Router();

const productManager = new ProductManager(
    path.resolve(process.cwd(), "public", "../src/public/products.json")
);


router.get('/a', async (req,res)=>{
    const products = await productManager.getProducts();
    const main = {
        title: "Productos sin socket.io",
        products
    };
    res.render("home", main)
});


router.get('/realTimeProducts', async (req,res)=>{
    const products = await productManager.getProducts();
    const main = {
        title: "Productos con socket.io",
        products
    };
    res.render("realTimeProducts", main)
});
*/