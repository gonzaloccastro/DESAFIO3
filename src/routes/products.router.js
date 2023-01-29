import express, { json } from 'express';
import  {ProductFileManager} from "../dao/classes/DbManager.js";


const productRouter = express.Router();
const productFileManager = new ProductFileManager();

productRouter.get('/', async (req,res)=>{
    try {
       const products = await productFileManager.read();
       res.send(products);
    } catch (error) {
        res.status(500).send(err.message);
    }
});

productRouter.post('/', async (req,res)=>{
    const newProduct = {
        ...req.body 
    };

    try{
        const response = await productFileManager.create(newProduct);
        res.send(response);
    } catch (error) {
        res.status(500).send(err.message);
    }
});


productRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const newProduct = req.body;
    try {
        const response = await productFileManager.update(pid, newProduct)
        res.send(response);
    } catch (error) {
        res.status(500).send(err.message);
    }
})

productRouter.delete("/:pid", async (req, res) => {
    const {pid} = req.params;
    const newProduct = req.body;
    try {
        const response = await productFileManager.delete(pid, newProduct)
        res.send({
                message:"Producto Eliminado",
                id: pid,
        })
    } catch (error) {
        res.status(500).send(err.message);
    }
}
)
export default productRouter;