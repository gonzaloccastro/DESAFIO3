import express, { json } from 'express';
import  {ProductFileManager} from "../dao/classes/DbManager.js";


const productRouter = express.Router();
const productFileManager = new ProductFileManager();

productRouter.get('/', async (req,res)=>{

    let limite = !req.params.limit ? 10 : parseInt(req.params.limit);
    let filtro = !req.params.query ? {} : req.params.query;
    let pagina = !req.params.page ? 1 : parseInt(req.params.page);
    let orden = !req.params.sort ? 1 : parseInt(req.params.sort);

    try {
        const fullProducts = await productFileManager.read();
       /*console.log(limite);
        let products = await productFileManager.paginate({filtro},{limite, pagina, orden,});*/

        let products = await productFileManager.paginate({filtro},{limite, pagina, orden,})
        console.log(...products.docs)
        res.render("products", products.docs);
    } catch (error) {
        res.status(500).send(error.message);
    }
})


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