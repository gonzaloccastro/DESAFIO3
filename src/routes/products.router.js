import { Router } from "express";
import DbManager from "../dao/classes/DbManager.js";

const router = Router();
const productManger = new DbManager.ProductManger(); 

router.get('/', async (req,res) => {
    const {limit, page, sort, query} = req.query
    let queryList = {limit, page, sort, query}
    
    try{
        const products = await productManger.getProduct(queryList);
        // res.status(200).send(products)
        res.send({status: 'success', products})
    }
    catch (err){
        res.status(500).send(err.message);
    }
})

router.post('/', async (req,res) => {
    const newProduct = {
        ...req.body,
      };
      try {
        const response = await productManger.createProduct(newProduct);
        res.send(response);
      } catch (err) {
        res.status(500).send(err.message);
      }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const product = req.body;
    try{
        const response = await productManger.updateProduct(id, product);
        res.send(response); 
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const response = await productManger.deleteProduct(id);
        res.send({
            message: 'Product deleted successfully',
            id: id
        })
    }
    catch(err) {
        res.status(500).send( err.message)
    }
})


export default router;


/*import express, { json } from 'express';
import  {ProductFileManager} from "../dao/classes/DbManager.js";
import userModel from '../models/user.model.js';


const productRouter = express.Router();
productRouter.use(express.json());
const productFileManager = new ProductFileManager();

productRouter.get('/', async (req,res)=>{
    const {limit, page, sort, query} = req.query;

    try {
        const products = await productFileManager.paginate({query: query || ""},{limit: parseInt(limit) || 10, page: parseInt(page) || 1, sort: parseInt(sort) || 1});
        const main = {
            title: "Productos",
            products: products.docs,
        };
        res.render("products", main,);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/*
productRouter.get('/products', async (req,res)=>{
    
    let limite = !req.params.limit ? 2 : parseInt(req.params.limit);
    let filtro = !req.params.query ? {} : req.params.query;
    let pagina = !req.params.page ? 2 : parseInt(req.params.page);
    let orden = !req.params.sort ? 1 : parseInt(req.params.sort);

    try {
        const fullProducts = await productFileManager.read();
        console.log(limite);
        let products = await productFileManager.paginate({filtro},{limite, pagina, orden,});
        console.log(products)
        res.send(products || fullProducts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});*/
/*
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
export default productRouter;*/