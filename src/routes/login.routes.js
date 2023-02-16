import { Router } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";

const router = Router();

router.get("/login", async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    res.render("login", {title: "Login" });
  } else {
    try {
      const response = await userModel.find({
        email: email,
        password: password,
      });
      console.log(response[0]);
      console.log("prueba 2 login" , response);
      if (response.length > 0) {
        res.send("Login encontrado",{ status: "success", payload: response });
      } else {
        //alert("Usuario no encontrado");
        res.render("login", {title: "Login no encontrado" });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
});

export default router;