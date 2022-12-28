import express from "express";
import {ProductManager} from "../productManager.js";
import path from "path";
import { v4 } from "uuid";


const productRouter = express.Router();

const productManager = new ProductManager(
    path.resolve(process.cwd(), "public", "../src/public/products.json")
    );

    productRouter.get("/", async (req, res) => {
        try {
        const products = await productManager.getProducts();
        const limit = req.query.limit;
        let limitedProducts;
        if (limit) {
            limitedProducts = products.slice(0, limit);
        }
        res.send(limitedProducts || products);
        } catch (err) {
        res.status(500).send(err.message);
        }
    });


    productRouter.get("/:pid", async (req, res) => {
        try {
            const pid = parseInt(req.params.id);
            const productFound = await productManager.getProductById(pid);
            if (!productFound) {
                res.status(404).send("Product not founded")
            } else {            
                res.send(productFound);
            }
            } catch (err) {
            res.status(404).send(err.message);
            }
    });

    productRouter.post("/", async (req, res) => {
        const newProduct = {
          id: v4(),
          ...req.body,
        };
      
        try {
          const products = await productManager.getProducts();
          await productManager.writeFile([...products, newProduct]);
          res.send(newProduct);
        } catch (err) {
          res.status(500).send(err.message);
        }
      });
      
      productRouter.put("/:pid", async (req, res) => {
        const { pid } = req.params;
        const newProduct = req.body;
      
        try {
          const products = await productManager.getProducts();
          const productIndex = products.findIndex((product) => product.id === pid);
          if (productIndex === -1) {
            res.status(404).send("Product not founded");
            return;
          }
      
          products[productIndex] = newProduct;
          await productManager.writeFile(products);
          res.send(newProduct);
        } catch (err) {
          res.status(500).send(err.message);
        }
      });
      
      productRouter.delete("/:pid", async (req, res) => {
        const { pid } = req.params;
      
        try {
          const products = await productManager.getProducts();
          const productIndex = products.findIndex((product) => product.id === pid);
          if (productIndex === -1) {
            res.status(404).send("Product not founded");
            return;
          }
      
          products.splice(productIndex, 1);
          await productManager.writeFile(products);
          res.send("Product deleted");
        } catch (err) {
          res.status(500).send(err.message);
        }
      });

export default productRouter;

