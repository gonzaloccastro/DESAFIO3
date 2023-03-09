
import { Router } from "express";
import passport from 'passport';
import registroModel from "../models/registro.model.js";
import { passportCall } from "../utils.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('login', {});
})

router.post('/user', passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req, res) => { 
    if(!req.user) return res.status(400).send({status: 'error', error: 'Usuario no encontrado'});
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        age: req.user.age
    }
    req.session.admin = true;
    return res.status(200).send({message:'success'},)
})

router.get('/faillogin', async (req, res) => {
    console.log('failed Strategy')
    res.send({error: 'Failed Strategy'})
})

const auth = async (req, res, next) => {
    if (await req.session?.user){
        return next()
    }else{
        return res.status(401).send('error de autenticación')
    }
}

router.get('/products', auth, passportCall('current'), async (req,res)=>{
    if (await req.session.user){
        const userData = await registroModel.findOne({ email: req.session.user.email})
        const {firstName, lastName} = userData;
        res.render('products',{firstName, lastName}) 
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.status(401).send({message:'ERROR'})
        }else{
            res.status(200).send({message:'LogoutOK'})
        }
    })
})

export default router



/*import { Router } from "express";
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

export default router;*/