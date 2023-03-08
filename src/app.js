import express, { Router } from "express";
import {engine} from "express-handlebars";
import __dirname from './utils.js';
import {ProductManager} from "./dao/classes/FileManager.js";
import mongoose from "mongoose";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import signupRouter from "./routes/signup.routes.js";
import loginRouter from "./routes/login.routes.js";
import bodyParser from "express";
import sessionRoutes from "./routes/session.routes.js";

import userService from "./models/user.model.js";
import passport from "passport";
import local from "passport-local";
import forgotRouter from "./routes/forgot.routes.js";
import { isValidPassword } from "./utils.js";
import initializePassport from "./config/passport.config.js";
import viewsRouter from "./routes/views.router.js";
import registroRouter from "./routes/registro.routes.js";
import productsRoutes from "./routes/products.router.js";
import cartRoutes from "./routes/carts.router.js";
import githubRoutes from "./routes/github.routes.js";

dotenv.config();
const PORT = process.env.PORT || 8080;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.rwwtfis.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const app = express();
const router = express.Router();

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

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/forgot", forgotRouter);

app.use(
  session({
    secret: "gonzaloPass",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: STRING_CONNECTION,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 300,
    }),
  })
);


app.use("/", viewsRouter);
app.use("/api/sessions", sessionRoutes);
app.use("/signup", signupRouter);
//app.use("/", loginRouter);

const LocalStrategy = local.Strategy;
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());



router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/signup",
    failureRedirect: "/forgot",
  }),
  (req, res) => {
    res.send({ status: "success", message: "user Registered" });
  }
);

router.get("/failRegister", (req, res) => {
  res.send({ status: "fail", message: "user not Registered" });
});

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await userService.findOne({ email: email });
        if (!user) {
          console.log("User not found");
          return done(null, false, { message: "User not found" });
        }
        if (!isValidPassword(user, password)) {
          console.log("Password incorrect");
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (error) {}
    }
  )
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      res.send({ status: "fail", message: "user not found" });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    res.send({ status: "success", message: "user found", payload: req.user });
  }
);

router.get("/faillogin", (req, res) => {
  res.send({ status: "fail", message: "failed login" });
});


const httpServer = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

const environment = async () => {
await mongoose
  .connect(STRING_CONNECTION)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log("Error de conexion", error));
};

/*
app.post("/socketMessage", (req, res) => {
const { message } = req.body;
socketServer.emit("message", message);
res.send("ok");
});
*/


const isEnvSetted = () => {
  if (DB_PASS && DB_USER) return true;
  else return false;
};

isEnvSetted && environment();

/*
socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);
});*/

/*
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket)=>{
  socket.emit("message", "Bienvenido")
  socket.on("message", (data)=>{
  console.log(data);
  const messagesFileManager = new MessagesFileManager;
  const messageToDb =  {
      user: data.user,
      message: data.message,
    };
  messagesFileManager.create(messageToDb);
})});*/
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

/*
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
  })})
});*/