import express, { json } from 'express';
import products from "../public/products.json" assert {type: 'json'};

const router = express.Router();
router.get('/',(req,res)=>{
    const main = {
        title: "Productos sin socket.io",
        products
    };
    res.render("home", main)
});

router.get('/realTimeProducts',(req,res)=>{
    const main = {
        title: "Productos con socket.io",
        products
    };
    res.render("realTimeProducts", main)
});

export default router;