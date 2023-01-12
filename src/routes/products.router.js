import express from "express";
import {ProductManager} from "../productManager.js";
import path from "path";

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
            const pid = parseInt(req.params.pid);
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
        try {
          const newProduct = {
            id: 1,
            ...req.body,
          };
          if (( !newProduct.title
                || !newProduct.description
                || !newProduct.code
                || !newProduct.price
                || !newProduct.status
                || !newProduct.stock
                || !newProduct.category
            )) {
            res.status(400).send("Missing data.")
          } else {
            await productManager.addProduct(newProduct);
            res.send(newProduct);
          }
        } catch (err) {
          res.status(500).send("Error posting product.");
        }
      });
      
      productRouter.put("/:pid", async (req, res) => {
        try {
          const { pid } = req.params;
          const newProduct = req.body;
          await productManager.updateProduct.getProducts(pid, newProduct);
          res.send(newProduct);
        } catch (err) {
          res.status(500).send(err.message);
        }
      });
      
      productRouter.delete("/:pid", async (req, res) => {
        try {
          const { pid } = req.params;
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

