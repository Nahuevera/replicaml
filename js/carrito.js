// Variables globales
let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorResumen = document.querySelector("#resumen-carrito");
const cantCarrito = document.querySelector("#num-en-carrito");

// Cargar productos en el carrito
function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disable");
        contenedorCarritoProductos.classList.remove("disable");
        contenedorResumen.classList.remove("disable");
        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            let tipo_envio = "";
            let tipo_estilo = "";
            if (producto.envio !== "Envio gratis") {
                tipo_envio = "$" + producto.envio.toLocaleString();
            } else {
                tipo_envio = "Envio gratis";
                tipo_estilo = "precio-envio";
            }
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <div class="carrito-producto-proveedor">
                    <span>${producto.proveedor}</span>
                </div>
                <div class="carrito-item">
                    <div class="container-producto-img">
                        <img src="${producto.imagen[0]}" alt="" class="carrito-producto-img">
                    </div>
                    <div class="carrito-producto-info">
                        <span class="carrito-producto-titulo">${producto.nombre}</span>
                        <div class="carrito-producto-opciones">
                            <button class="carrito-producto-eliminar" data-id="${producto.id}">
                                Eliminar
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="container-selector-cantidad">
                        <div class="selector">
                            <button class="restar-cantidad" data-id="${producto.id}">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <div class="cantidad">${producto.cantidad}</div>
                            <button class="sumar-cantidad" data-id="${producto.id}">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                    <div class="carrito-producto-precio">
                        <p>$ ${(producto.precio * producto.cantidad).toLocaleString()}</p>
                    </div>
                </div>
                <div class="carrito-precio-envio">
                    <span>Envío</span>
                    <span class="${tipo_estilo}">${tipo_envio}</span>
                </div>
                <div class="carrito-producto-mas-info">
                    <span>Aprovecha tu Envío Gratis agregando más productos <a href="#">ver más productos del vendedor</a></span>
                </div>
            `;
            contenedorCarritoProductos.append(div);
        });

        actualizarResumenCarrito();
        agregarEventListenerBotonSumarCantidad();
        agregarEventListenerBotonRestarCantidad();
        agregarEventListenerBotonesEliminar();
        actualizarNumEnCarrito();
    } else {
        contenedorCarritoVacio.classList.remove("disable");
        contenedorCarritoProductos.classList.add("disable");
        contenedorResumen.classList.add("disable");

        actualizarNumEnCarrito();
    }
}

// Actualizar resumen del carrito
function actualizarResumenCarrito() {
    const totalProductos = document.querySelector(".num-total");
    if (totalProductos) {
        totalProductos.innerHTML = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    }

    const totalCompra = document.querySelector(".precio-productos-compra");
    if (totalCompra) {
        totalCompra.innerHTML = "$" + productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0).toLocaleString();
    }

    const precioTotalEnvio = document.querySelector(".carrito-resumen-precio-envio");
    if (precioTotalEnvio) {
        const productosFiltrados = productosEnCarrito.filter(producto => producto.envio !== "Envio gratis");
        const calculoSumaEnvio = productosFiltrados.reduce((acc, producto) => acc + producto.envio, 0); 
        precioTotalEnvio.innerHTML = "$" + calculoSumaEnvio.toLocaleString();
    }

    const precioFinal = document.querySelector(".precio-final");
    if (precioFinal) {
        const calculoPrecioFinal = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0) + 
                                    productosEnCarrito.filter(producto => producto.envio !== "Envio gratis")
                                                      .reduce((acc, producto) => acc + producto.envio, 0);
        precioFinal.innerHTML = "$" + calculoPrecioFinal.toLocaleString();
    }
}

// Eventos para sumar cantidad de productos en el carrito
function agregarEventListenerBotonSumarCantidad() {
    const botonesSumar = document.querySelectorAll(".sumar-cantidad");
    botonesSumar.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            sumarEnCarrito(id);
        });
    });
}

// Eventos para restar cantidad de productos en el carrito
function agregarEventListenerBotonRestarCantidad() {
    const botonesRestar = document.querySelectorAll(".restar-cantidad");
    botonesRestar.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            restarEnCarrito(id);
        });
    });
}

// Actualizar número de productos en el carrito
function actualizarNumEnCarrito() {
    let nuevaCantEnCarrito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    if (cantCarrito) {
        cantCarrito.innerHTML = nuevaCantEnCarrito;
    } else {
        console.error("No se encontró el elemento 'num-en-carrito' en el DOM");
    }
}

// Eventos para eliminar productos del carrito
function agregarEventListenerBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            eliminarDelCarrito(id);
        });
    });
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    const indice = productosEnCarrito.findIndex(producto => producto.id === id);
    productosEnCarrito.splice(indice, 1);
    actualizarLocalStorage();
    cargarProductosCarrito();
}

// Sumar cantidad de producto en el carrito
function sumarEnCarrito(id) {
    const indice = productosEnCarrito.findIndex(producto => producto.id === id);
    productosEnCarrito[indice].cantidad++;
    actualizarLocalStorage();
    cargarProductosCarrito();
}

// Restar cantidad de producto en el carrito
function restarEnCarrito(id) {
    const indice = productosEnCarrito.findIndex(producto => producto.id === id);
    if (productosEnCarrito[indice].cantidad > 1) {
        productosEnCarrito[indice].cantidad--;
    } else if (productosEnCarrito[indice].cantidad === 1) {
        const confirmar = confirm("¿Seguro que quieres eliminar el producto?");
        if (confirmar) {
            eliminarDelCarrito(id);
        } else {
            return;
        }
    }
    actualizarLocalStorage();
    cargarProductosCarrito();
}

// Actualizar localStorage
function actualizarLocalStorage() {
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Asegurarse de actualizar el número en el carrito en la página de inicio también
document.addEventListener("DOMContentLoaded", () => {
    actualizarNumEnCarrito();
});

// Inicialización
cargarProductosCarrito();
