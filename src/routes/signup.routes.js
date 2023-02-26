import { Router } from "express";
import userModel from "../models/user.model.js";

const router = Router();

router.get("/", (req, res) => {
    console.log("Nuevo usuario para registrarse");
    res.render("signup", { title: "Signup"});
  });

router.post("/", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password,
  };

  try {
    const response = await userModel.create(newUser);
    res.send({ status: "success", payload: response }).redirect('/login');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;