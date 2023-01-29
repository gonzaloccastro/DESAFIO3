import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Corriendo desde el servidor");
  res.render("chat", {});
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