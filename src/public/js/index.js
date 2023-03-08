//----------------------------------------- REGISTRO ------------------------------------------------------

const elementExists = (id) => document.getElementById(id) !== null;

elementExists("signup") &&
  document.getElementById("signup").addEventListener("click", function () {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const age = document.getElementById("age").value;

    const data = { firstName, lastName, email, password, age };
    console.log(data);

    fetch("/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((data) => {
      const result = data.json();
      console.log(result);
      if (data.status === 200) {
        window.location.href = "/api/login";
      } else {
        alert("El email ya existe");
      }
    });
  });

// -------------------------------------------LOGIN ----------------------------------------------------

const handleLogin = async (email, password) => {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  try {
    const response = await fetch(`/api/login/user`, config);
    const data = await response.json();
    console.log(data);
    return data.message;
  } catch (error) {
    console.log(error);
  }
};

elementExists("send") &&
  document.getElementById("send").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    handleLogin(email, password).then((data) => {
      if (data === "success") {
        window.location.href = "/api/login/products";
      } else {
        alert("Usuario o contraseña incorrecta");
      }
    });
  });

elementExists("logout") &&
  document
    .getElementById("logout")
    .addEventListener("click", async function () {
      try {
        const response = await fetch("/api/login/logout");
        const data = await response.json();
        console.log(data);
        if (data.message === "Te has deslogueado") {
          window.location.href = "/api/home";
        } else {
          alert("Salió mal el deslogueo");
        }
      } catch (error) {
        console.log(error);
      }
    });

// -----------------------PRODUCTOS------------------------------------------------------

let containerCards = document.getElementById("containerCards");
let containerCart = document.getElementById("containerCart");
let btnAnterior = document.getElementById("btnAnterior");
let btnSiguiente = document.getElementById("btnSiguiente");
let linkCarrito = document.getElementById("linkCarrito");
let tituloCarrito = document.getElementById("tituloCarrito");
let pag = document.getElementById("pag");
let pagina = 1;
let limite;

const paginaProductos = () => {
  const getProduct = async (limit = 2, page = 1) => {
    const product = await fetch(`/api/products/?limit=${limit}&page=${page}`);
    const result = await product.json();
    console.log(result);
    return result;
  };

  const renderProducts = async () => {
    const products = await getProduct();

    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };

  renderProducts();

  const render = (products) => {
    containerCards.innerHTML = "";
    products.products.docs.map((prod) => {
      console.log("prod", prod);
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `<div class="card" style="width: 15rem; margin: 5px">
        <div class="card-body">
        <h5 class="card-title">${prod.title}</h5>
        <p class="card-text"> ${prod.description}</p>
        <p class="card-text">PRECIO: $${prod.price}</p>
        <p class="card-text">CATEGORIA: ${prod.category}</p>
        <p class="card-text">Codigo: ${prod.code}</p>
        </div>
        <button class="btn btn-primary mx-auto mb-1" id=${prod._id}>Agregar al Carrito</button>
        </div>`;
      containerCards.appendChild(item);
      const btnAgregar = document.getElementById(prod._id);
      btnAgregar.addEventListener("click", () => addCart(prod._id));
    });
  };

  const siguiente = async () => {
    pagina++;
    pag.innerHTML = pagina;
    const products = await getProduct(2, pagina);
    console.log(products);
    if (!products.products.hasNextPage) {
      btnSiguiente.disabled = true;
    }
    if (products.products.hasPrevPage) {
      btnAnterior.disabled = false;
    }

    render(products);
  };
  const anterior = async () => {
    pagina--;
    pag.innerHTML = pagina;
    const products = await getProduct(2, pagina);
    console.log(products);
    if (!products.products.hasPrevPage) {
      btnAnterior.disabled = true;
    }
    if (products.products.hasNextPage) {
      btnSiguiente.disabled = false;
    }

    render(products);
  };

  btnSiguiente.addEventListener("click", siguiente);
  btnAnterior.addEventListener("click", anterior);
};
elementExists("pag") && paginaProductos();


//---------------------------------- CARRITO -------------------------------------------------------
const getCart = async () => {
  const cart = await fetch("/api/carts");
  const data = cart.json();
  return data;
};

const addCart = async (pid) => {
  const carrito = await getCart();
  console.log(carrito);

  try {
    const addCartProduct = await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "PUT",
    });
    alert("Producto agregado al carrito");
  } catch (err) {
    console.log(err);
  }
};

const renderCart = async () => {
  const productos = await getCart();
  console.log(productos);
  const list = await productos[0].products
    .map((prod) => {
      return `<div class="card" style="width: 15rem; margin: 5px">
                    <div class="card-body">
                        <h5 class="card-title">${prod.product.title}</h5>
                        <p class="card-text"> ${prod.product.description}</p>
                        <p class="card-text">PRECIO: $${prod.product.price}</p>
                        <p class="card-text">CATEGORIA: ${prod.product.category}</p>
                        <p class="card-text">Codigo: ${prod.product.code}</p>
                     </div>
                 </div>`;
    })
    .join(" ");
  containerCart.innerHTML = list;
};
elementExists("containerCart") && renderCart();



/*const elementExists = (id) => document.getElementById(id) !== null;

elementExists("send") &&
document.getElementById("send").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    /* 
    console.log(email, password)
    await fetch(`/?email=${email}&password=${password}`)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    });*/
    /*
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
});

elementExists("getButton") &&
  document.getElementById("getButton").addEventListener("click", function () {
    fetch("/getSignedCookie").then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    });
});

elementExists("signup") &&
document.getElementById("signup").addEventListener("click", function () {
  const myForm = document.getElementById("myForm");
  const formData = new FormData(myForm);
  const data = Object.fromEntries(formData);
  console.log(data);

  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
});

elementExists("forgotPassword") &&
document
  .getElementById("forgotPassword")
  .addEventListener("click", function () {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
});








/*const socket = io();
let chatBox = document.getElementById("chatBox");
*/


/*
console.log("desde el cliente");
let user;
Swal.fire({
  title: "Dinos tu nombre",
  text: "Cómo te llamas?",
  input: "text",
  confirmButtonText: "Enviar",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return "Debe ingresar un nombre de usuario";
    }
  },
}).then((result) => {
  if (result.value) {
    user = result.value;
    socket.emit("new-user", { user: user, id: socket.id });
  }
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user: user,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let message = "";

  data.forEach((elem) => {
    message += `
   
      <div class="chat-message">
      <div class="message-bubble">
        <div class="message-sender">${elem.user}</div>
        <p>${elem.message}</p>
        </div>
      </div>
    `;
  });

  log.innerHTML = message;
});

socket.on("new-user-connected", (data) => {
  if (data.id !== socket.id)
    Swal.fire({
      text: `${data.user} se ha conectado al chat`,
      toast: true,
      position: "top-end",
    });
});

function firstLoad() {
  let log = document.getElementById("messageLogs");

  fetch("/messages")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let message = "";

      data.forEach((elem) => {
        message += `
      <div class="chat-message">
        <div class="message-bubble">
          <div class="message-sender">${elem.user}</div>
          <p>${elem.message}</p>
        </div>
      </div>
      `;
      });

      log.innerHTML = message;
    });
}

firstLoad();
*/

/*
const socket = io();
socket.emit("message", "Listo desde cliente.");

document.getElementById("submit").addEventListener("click", function () {
    const socketId = socket.id;
    const data = {
      id: socketId,
      title: document.getElementById("prodTitle").value,
      description: document.getElementById("prodDescription").value,
      code: document.getElementById("prodCode").value,
      price: document.getElementById("prodPrice").value,
      stock: document.getElementById("prodStock").value,
      category: document.getElementById("prodCategory").value,
      thumbnail: document.getElementById("prodThumbnail").value
    };
    socket.emit("new-message", data);
});
*/
/*
document.getElementById("submitDelete").addEventListener("click", function () {

    const productId =
        {
        id: document.getElementById("delId").value}
    socket.emit("delete", productId);
});
*/

