import express, { json } from 'express';
/*import { uuid } from 'uuidv4';*/
import  {CartFileManager} from "../dao/classes/DbManager.js";


const cartRouter = express.Router();
const cartFileManager = new CartFileManager();

cartRouter.get('/', async (req,res)=>{
    try {
       const carts = await cartFileManager.read();
       res.send(carts);
    } catch (error) {
        res.status(500).send(err.message);
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
        res.status(500).send(err.message);
    }
});


cartRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const newCart = req.body;
    try {
        const response = await cartFileManager.update(pid, newCart)
        res.send(response);
    } catch (error) {
        res.status(500).send(err.message);
    }
})

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
        res.status(500).send(err.message);
    }
}
)
export default cartRouter;