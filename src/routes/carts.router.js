import express, { json } from 'express';
/*import { uuid } from 'uuidv4';*/
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
    console.log(carts);
    res.render("carts", main,);
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
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


cartRouter.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const newProduct = (req.body);

    try {
        const response = await cartFileManager.update(cid, newProduct);
        res.send(response);

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
        res.send(response);

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
        console.log(response);
        res.send(response)
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

export default cartRouter;