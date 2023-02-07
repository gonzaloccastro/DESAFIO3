import express, { json } from 'express';
import  {ProductFileManager} from "../dao/classes/DbManager.js";


const productRouter = express.Router();
const productFileManager = new ProductFileManager();

productRouter.get('/', async (req,res)=>{
    const {limit, offset, queryField, queryValue, queryOperator} = req.query;

    try {
       const products = await productFileManager.read();

       const limit = req.query.limit;
       let limitedProducts;
       if (limit) {
       limitedProducts = products.slice(0, limit);
       }

       res.send(limitedProducts || products);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

productRouter.get('/:pid', async (req,res)=>{
    try {
        const pid = req.params.pid;
        const products = await productFileManager.read();
        const product = products.find((product) => product.id === pid);
        res.send(product);

    } catch (error) {
        res.status(500).send(error.message);
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
        res.status(500).send(error.message);
    }
});


productRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const newProduct = req.body;
    try {
        const response = await productFileManager.update(pid, newProduct)
        console.log(response);
        const products = await productFileManager.read();
        const product = products.find((product) => product.id === pid);
        res.send (product);
    } catch (error) {
        res.status(500).send(error.message);
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
        res.status(500).send(error.message);
    }
}
)
export default productRouter;