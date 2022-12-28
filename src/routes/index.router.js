import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.send("<h1>Hola, bienvenido!</h1>");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


export default router;
