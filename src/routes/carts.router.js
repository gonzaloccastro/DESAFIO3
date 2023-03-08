import { Router } from "express";
import DbManager from "../dao/classes/DbManager.js";


const router = Router();
const cartManager = new DbManager.CartManager();

router.get('/', async (req, res) => {
    try{
        const cart = await cartManager.getCart()
        res.send(cart)
    }
    catch (err){
        res.status(500).send(err.message)
    }
})


router.post('/', async (req, res) => {
    try{
        const response = await cartManager.createCart([])
        res.send(response)
    }
    catch (err){
        res.status(500).send(err.message)
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;
    let {quantity} = req.body
    try {
        const response = await cartManager.addProductToCart(cid, pid, quantity);
        res.send(response);
      } catch (err) {
        res.status(500).send(err.message);
      }
})
router.delete('/:cid/products/:pid', async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;

    try {
        const response = await cartManager.removeProductFromCart(cid, pid);
        res.send({
            message: 'Product deleted successfully',
            id: pid
        })
      } catch (err) {
        res.status(500).send(err.message);
      }
})

router.delete('/:cid' , async (req,res)=>{
    const {cid} = req.params;
    try {
        const response = await cartManager.deleteAllProductCart(cid);
        res.send({
            message: 'Cart deleted successfully',
            id: cid
        })
    }
    catch (err) {
        req.status(500).send(err.message)
    }
})

export default router

/*import express, { json } from 'express';*/
/*import { uuid } from 'uuidv4';*/
/*
import  {CartFileManager} from "../dao/classes/DbManager.js";
import { ProductFileManager } from '../dao/classes/DbManager.js';


const cartRouter = express.Router();
cartRouter.use(express.json());
const cartFileManager = new CartFileManager();
const productFileManager = new ProductFileManager();

cartRouter.get('/carts', async (req,res)=>{
    try {
       const carts = await cartFileManager.read();
       const main = {
        title: "Carritos",
        carts: carts,
    };
    console.log(JSON.stringify(carts, null, "\t"));
    res.render("carts", main, {status:"success", payload: response});
    } catch (error) {
    res.status(500).send(error.message);
    }
});

cartRouter.post('/', async (req,res)=>{
    const newCart = {
        ...req.body 
    };

    try{
        const response = await cartFileManager.create(newCart);
        res.send(response, {status:"success", payload: response});
    } catch (error) {
        res.status(500).send(error.message);
    }
});


cartRouter.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const newProduct = (req.body);

    try {
        const response = await cartFileManager.update(cid, newProduct);
        res.send(response, {status:"success", payload: response});

    } catch (error) {
        res.status(500).send(error.message);
    }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const newQuantity = {
        ...req.body 
    };
    try {
        const response = await cartFileManager.update(cid, newQuantity);
        res.send(response, {status:"success", payload: response});

    } catch (error) {
        res.status(500).send(error.message);
    }
});


cartRouter.delete("/:pid", async (req, res) => {
    const {pid} = req.params;
    const newProduct = req.body;
    try {
        const response = await cartFileManager.delete(pid, newProduct)
        res.send({
                message:"Producto Eliminado",
                id: pid,
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}
)

cartRouter.delete("/delete", async (req, res) => {
    try {
        const response = await cartFileManager.deleteAllCarts({});
        res.send(response, {status:"success", payload: response})
    } catch (error) {
        res.status(500).send(error.message);
    }
}
)


cartRouter.get("/:cid", async (req,res)=>{
    try {
        const cid = req.params.cid;
        const carts = await cartFileManager.read();
        const cart = carts.find((cart) => cart.id === cid);
        res.send(cart);

    } catch (error) {
        res.status(500).send(error.message);
    }
    }
);

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const {cid, pid} = req.params;
  
    try {
      const carts = await cartFileManager.read();
      const cart = carts.find((cart) => cart.id == cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const response = await cartFileManager.updateCart(cid, pid);
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }   
)

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const {cid, pid} = req.params;
  
    try {
      const carts = await cartFileManager.read();
      const cart = carts.find((cart) => cart.id == cid);
      if (!cart) {
        throw new Error("Cart not found");
      }
      const products = await productFileManager.read();
      const product = products.find((product) => product.id === pid);
      const response = await cartFileManager.deleteProductFromCart(cid, product);
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }   
)

export default cartRouter;*/