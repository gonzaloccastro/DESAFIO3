import express from "express";
import {engine} from "express-handlebars";
import __dirname from './utils.js';
import router from "./routes/views.router.js";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import {ProductManager} from "./productManager.js";
import path from "path";


const app = express();
const PORT = 8080;

app.engine('handlebars', engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

app.use("/", router)
app.use("/realTimeProducts", router)  

const httpServer = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    console.log(`Iniciado con socket.io`)
  });

  const socketServer = new Server(httpServer);
  socketServer.on("connection", (socket)=>{
    console.log("Cliente conectado.");
    socket.emit("message", "Bienvenido")
    socket.on("message", (data)=>{
      console.log(data);
    });
    socket.on("new-message", (data) => {
      const uploader = new ProductManager(
        path.resolve(process.cwd(), "public", "../src/public/products.json")
      );
      uploader.addProduct(data);
    });
    socket.on("delete", (idProduct) => {
      const deleteProduct = new ProductManager(
        path.resolve(process.cwd(), "public", "../src/public/products.json")
      );
      deleteProduct.deleteProduct(idProduct);
    });
  });