import fs from "fs";

class FileManager {
  constructor(path) {
    this.path = path;
  }

  async readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, "utf-8", (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }

  async getInfo() {
    try {
      const info = await fs.promises.readFile(this.path);
      return JSON.parse(info);
    } catch (err) {
      throw err;
    }
  }

  async writeFile(info) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(info, null, "\t"), (err) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      });
    });
  }}
  class ProductManager extends FileManager {
    async addProduct(product) {
      try {
        const info = await this.readFile();
        if (info) {
          this.products = JSON.parse(info);
        }
        product.id = this.products.length
          ? this.products.reduce(
              (max, product) => (product.id > max ? product.id : max),
              0) + 1 : 1;
        this.products.push(product);
        await this.writeFile(this.products);
      } catch (err) {
        throw err;
      }
    }

    async getProducts() {
      try {
        const info = await this.readFile();
        this.products = JSON.parse(info);
        return this.products;
      } catch (err) {
        throw err;
      }
    }

    async getProductById(id) {
      try {
        const info = await this.readFile();
        this.products = JSON.parse(info);
        const product = this.products.find((product) => product.id === id);
        return product;
      } catch (err) {
        throw err;  
      }
    }

    async updateProduct(id, products) {
      try {
        const info = await this.readFile();
        this.products = JSON.parse(info);
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1) {
          throw new Error("Product not found");
        }
        products.id=id;
        products[index] = products;
        await this.writeFile(this.products);
      } catch (err) {
        throw err;
      }
    }

    async deleteProduct(id) {
      try {
        const info = await this.readFile();
        this.products = JSON.parse(info);
        const index = this.products.findIndex((product) => product.id === parseInt(id));
        if (index === -1) {
          throw new Error("Product not found");
        }
        this.products.splice(index, 1);
        await this.writeFile(this.products);
      } catch (err) {
        throw err;
      }
    }
  };
class CartFileManager extends FileManager {
  async addProduct(cartId, productId) {
    try {
      const carts = await this.getInfo();

      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.products.push(productId);

      await this.writeFile(carts);
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const carts = await this.getInfo();
      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const index = cart.products.findIndex((product) => product === productId);
      if (index === -1) {
        throw new Error("Product not found");
      }

      cart.products.splice(index, 1);

      await this.writeFile(carts);
    } catch (err) {
      throw err;
    }
  }
}

export {FileManager, ProductManager, CartFileManager};