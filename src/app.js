import express from "express";
import path from "path";
import ProductManager from "./productManager.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const productManager = new ProductManager(
    path.resolve(process.cwd(), "public", "products.json")
  );
  app.get("/", (req, res) => {
    res.send("<h1>Welcome to Arbol Store</h1>");
  });
  
  app.get("/products", async (req, res) => {
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


  app.get("/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const productFound = await productManager.getProductById(id);
        if (!productFound) {
            res.status(404).send("<h1>Product not founded</h1>")
          } else {            
            res.send(productFound);
          }
        } catch (err) {
          res.status(404).send(err.message);
        }
    });

  app.post("/products", async (req, res) => {
    try {
      const products = await productManager.getProducts();
      const newProduct = req.body;
      await productManager.addProduct(products, newProduct);
      res.send(newProduct);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });