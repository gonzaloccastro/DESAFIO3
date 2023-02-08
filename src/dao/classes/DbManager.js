import fs from "fs";
import mongoose from "mongoose";
import { productModel } from "../../models/products.model.js";
import { cartModel } from "../../models/cart.model.js";
import { messagesModel } from "../../models/messages.model.js";


class ProductFileManager {
  async read() {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      throw err;
    }
  }

  async paginate({},{limite, pagina, orden}) {

    try {
      const limit=limite;
      
      const page=pagina;
      console.log(page)


      const sort={price:orden};
      console.log(sort)

      let products = await productModel.paginate({}, {limit:limit, page:page, sort:sort,});

      return products;

    } catch (err) {
        throw err;  
    }
  }

  async create(product) {
    try {
      const newProduct = new productModel(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async update(id, product) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(id, product);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const updatedProduct = await productModel.findByIdAndDelete(id);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
}

class CartFileManager {
  async read() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (err) {
      throw err;
    }
  }

  async create(cart) {
    try {
      const newCart = new cartModel(cart);
      await newCart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async update(id, product) {
    try {
      const myProduct = {
        title:product.title,
        quantity:1,
      }

      const readPrevData = await cartModel.findById(id);
      const previousCart = readPrevData.products;
      
      let checkExists = previousCart.findIndex((prod)=>prod.title === product.title)
      if (checkExists!==-1) {
        myProduct.quantity = previousCart(checkExists).quantity + 1;
      }
      previousCart.splice(checkExists, 1, myProduct);
      const cart = { product:previousCart};
      console.log(cart);
 
      const updatedCart = await cartModel.findByIdAndUpdate(id, cart);
      console.log(cart);

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cid, pid) {

    try {
  
     const readPrevData = await cartModel.findById(cid);
     let previousCart = readPrevData.products;
     let checkExists = previousCart.findIndex((prod)=>prod.product == pid)
     if (checkExists !== -1) {
      let quantity = previousCart[checkExists].quantity;
      quantity++;
      previousCart[checkExists].quantity = quantity;
      readPrevData.products = previousCart;
      await cartModel.findByIdAndUpdate(cid, readPrevData);
      const updatedCart = await cartModel.findById(cid);
      return updatedCart;
     } else {
      const newProduct = {
       product: pid,
       quantity: 1,
      };

      previousCart.push(newProduct);
      readPrevData.products = previousCart;
      await cartModel.findByIdAndUpdate(cid, readPrevData);
      const cartAdded = await cartModel.findById(cid);
      return cartAdded;
     }
  
    } catch (error) {
  
     throw error;
  
    }
  
   }

  async delete(id) {
    try {
      const deletedCart = await cartModel.findByIdAndDelete(id);
      return deletedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(id, product) {
    try {
      const readPrevData = await cartModel.findById(id);
      const previousCart = readPrevData.products;

      let checkExists = previousCart.findIndex((prod)=>prod.title === product.title)
      if (checkExists!==-1) {
        previousCart.splice(checkExists, 1);
      }

      const cart = { product:previousCart};

      const updatedCart = await cartModel.findByIdAndUpdate(id, cart);
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }


  async deleteAllCarts({}) {
    try {
      const deletedCart = await cartModel.deleteMany({});
      console.log(deletedCart);
      return deletedCart;
    }
    catch (error){
        console.log(error);
    }
  };

 async decreaseProductQuantity(id, product) {
    try {
      const readPreviousCart = await cartModel.findById(id);
      const previousCart = readPreviousCart.products;

      let checkExists = previousCart.findIndex(
        (prod) => prod.title === product.title
      );
      if (checkExists !== -1) {
        if (previousCart[checkExists].quantity > 1) {
          previousCart[checkExists].quantity -= 1;
        } else {
          previousCart.splice(checkExists, 1);
        }
      }

      const cart = { products: previousCart };

      const updatedCart = await cartModel.findByIdAndUpdate(id, cart);
      return updatedCart;
    } catch (err) {
      throw err;
    }
  }}

  class MessagesFileManager {
    async read() {
      try {
        const messages = await messagesModel.find();
        return messages;
      } catch (err) {
        throw err;
      }
    }
  
    async create(message) {
      try {
        const newMessage = new messagesModel(message);
        await newMessage.save();
        return message;
      } catch (error) {
        throw error;
      }
    }};

export {ProductFileManager, CartFileManager, MessagesFileManager};