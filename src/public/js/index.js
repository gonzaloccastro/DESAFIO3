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
      stock: document.getElementById("prodCategory").value,
      thumbnail: document.getElementById("prodThumbnail").value
    };
    socket.emit("new-message", data);
});

document.getElementById("submitDelete").addEventListener("click", function () {

    const productId =
        {
        id: document.getElementById("delId").value}
    socket.emit("delete", productId);
});


