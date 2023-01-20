import express, { json } from 'express';

const router = express.Router();
import {ProductManager} from "../productManager.js";
import path from "path";

const productManager = new ProductManager(
    path.resolve(process.cwd(), "public", "../src/public/products.json")
);

router.get('/', async (req,res)=>{
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

export default router;