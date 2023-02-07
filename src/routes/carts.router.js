import express, { json } from 'express';
/*import { uuid } from 'uuidv4';*/
import  {CartFileManager} from "../dao/classes/DbManager.js";
import { ProductFileManager } from '../dao/classes/DbManager.js';


const cartRouter = express.Router();
const cartFileManager = new CartFileManager();
const productFileManager = new ProductFileManager();

cartRouter.get('/', async (req,res)=>{
    try {
       const carts = await cartFileManager.read();
       res.send(carts);
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
        const products = await productFileManager.read();
        const product = products.find((product)=> product.id === pid);

        const carts = await cartFileManager.read();
        const cart = carts.find((cart) => cart.id === cid);
        if (!cart) {
            throw new Error("Cart not found");
        }

        cart.products.push(pid);

        res.send(cart)

    } catch (error) {
        res.status(500).send(error.message);
    }
}   
)


export default cartRouter;