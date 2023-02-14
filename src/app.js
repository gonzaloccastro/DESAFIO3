import express, { Router } from "express";
import {engine} from "express-handlebars";
import __dirname from './utils.js';
import router from "./routes/views.router.js";
import { Server } from "socket.io";
import {ProductManager} from "./dao/classes/FileManager.js";
import path from "path";
import mongoose from "mongoose";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import { MessagesFileManager } from "./dao/classes/DBManager.js";
import * as dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8080;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const app = express();

app.engine('handlebars', engine(
  {
    extname: 'handlebars',  
    runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true}
  }
));

app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

app.use("/", productRouter);
app.use("/carts", cartRouter);
app.use("/chat", router);


const messages = [];

/*app.use("/realTimeProducts", router)*/  

const httpServer = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    /*console.log(`Iniciado con socket.io`)*/
  });

const environment = async () => {
  mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.rwwtfis.mongodb.net/${DB_NAME}`, (error) => {
      if (error) {
        console.log("Error de conexión");
        process.exit();
      } else {
        console.log("Conectado a la base de datos");
      }
    }
  );
}
environment();


const socketServer = new Server(httpServer);
socketServer.on("connection", (socket)=>{
console.log("Cliente conectado.");
socket.emit("message", "Bienvenido")
socket.on("message", (data)=>{
  console.log(data);

  const messagesFileManager = new MessagesFileManager;
  const messageToDb =  {
      user: data.user,
      message: data.message,
    };
  messagesFileManager.create(messageToDb);
});
/*
socket.on("new-message", (data) => {
  const uploader = new ProductManager(
    path.resolve(process.cwd(), "public", "../src/public/products.json")
  );
  uploader.addProduct(data);
});*/
/*
socket.on("delete", (productId) => {
  const deleteProductById = new ProductManager(
    path.resolve(process.cwd(), "public", "../src/public/products.json")
  );
  const idToDelete = productId.id;
  deleteProductById.deleteProduct(idToDelete);
});
*/

app.get("/", (req, res) => {
  res.send("Hola!");
});
app.post("/socketMessage", (req, res) => {
  const { message } = req.body;
  socketServer.emit("message", message);
  res.send("ok");
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!");
  socket.on("new-user", (data) => {
    socket.user = data.user;
    socket.id = data.id;
    socket.message = data.message;
    socketServer.emit("new-user-connected", {
      user: socket.user,
      id: socket.id,
    });
  });

  socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);

  });

  });


});

const isEnvSetted = () => {
  if (DB_PASS && DB_USER) return true;
  else return false;
};

isEnvSetted && environment();