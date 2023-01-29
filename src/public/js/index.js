const socket = io();
let chatBox = document.getElementById("chatBox");

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



/* const socket = io();
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

document.getElementById("submitDelete").addEventListener("click", function () {

    const productId =
        {
        id: document.getElementById("delId").value}
    socket.emit("delete", productId);
}); */ 


