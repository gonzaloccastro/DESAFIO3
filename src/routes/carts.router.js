import express from "express";
import {CartFileManager, ProductManager} from "../productManager.js";
import path from "path";
import { v4 } from "uuid";

const cartRouter = express.Router();
const cartFileManager = new CartFileManager(
  path.resolve(process.cwd(), "public", "../src/public/carts.json")
);
const productManager = new ProductManager(
  path.resolve(process.cwd(), "public", "../src/public/products.json")
);

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await cartFileManager.getInfo();
    res.send(carts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

cartRouter.post("/", async (req, res) => {
  const newCart = {
    id: v4(),
    products: [],
  };

  try {
    const carts = await cartFileManager.getInfo();
    await cartFileManager.writeFile([...carts, newCart]);
    res.send(newCart);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const carts = await cartFileManager.getInfo();
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
      res.status(404).send("Cart not founded");
      return;
    }
    res.send(cart);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const carts = await cartFileManager.getInfo();
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
      res.status(404).send("Cart not founded");
      return;
    }
    const products = await productManager.getInfo();
    const product = products.find((product) => product.id === pid);
    if (!product) {
      res.status(404).send("Product not founded");
      return;
    }
    const productInCart = cart.products.find((product) => product.id === pid);
    if (productInCart) {
      productInCart.quantity++;
      await cartFileManager.writeFile(carts);
      res.send("Product added to the cart");
      return;
    } else {
      cart.products.push({ id: pid, quantity: 1 });
      await cartFileManager.writeFile(carts);
      res.send("Product added to the cart");
      return;
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const productInCart = cart.products.find((product) => product.id === pid);
    if (productInCart) {
      if (productInCart.quantity > 1) {
        productInCart.quantity--;
        await cartFileManager.writeFile(carts);
        res.send("Product deleted from cart");
        return;
      } else {
        cart.products = cart.products.filter((product) => product.id !== pid);
        await cartFileManager.writeFile(carts);
        res.send("Product deleted from cart");
        return;
      }
    } else {
      res.status(404).send("Product not founded in cart");
      return;
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const carts = await cartFileManager.getInfo();
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
      res.status(404).send("Cart not founded");
      return;
    }
    const newCarts = carts.filter((cart) => cart.id !== cid);
    await cartFileManager.writeFile(newCarts);
    res.send("Cart deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default cartRouter;
