// Guardo mis productos en localStorage
const guardarProdEnLS = (array) => {
    localStorage.setItem("productos", JSON.stringify(array));
}

// Cargo mis productos de localStorage
const cargarProdEnLS = () => {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

// Render de productos
const renderProductos = () => {
    const prodALaVenta = cargarProdEnLS()
    let renderProd = "";
    prodALaVenta.forEach(prod => {
        renderProd += `<div class="card m-2" style="width: 18rem;">
        <a href="./item.html" onclick="guardarItemLS(${prod.id})"><img src="${prod.image}" height="250" class="card-img-top rounded p-1" alt="${prod.title}"></a>
        <div class="card-body">
            <h5 class="card-title">$${prod.ivaIncluido.toFixed(2)}</h5>
            <p class="card-text text-secondary">${prod.title}</p>
            <a class="btn btn-outline-success" id="btnAgregar" onclick="agregarAlCarrito(${prod.id})">Agregar</a>
        </div>
    </div>`
    })

    let contenidoProductos = document.getElementById("contenidoProductos");
    contenidoProductos.innerHTML = renderProd
}

// Funcion para guardar mis productos en carrito en LS
const guardarCarritoLS = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Obtengo productos de carrito de LS
const obtenerCarritoLS = () => {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Busco el producto en mi array de productos LS
const buscarProducto = (id, array) => {
    const productos = array;
    const producto = productos.find(prod => prod.id === id);

    return producto;
}

// Obtengo array carrito, llamo a la funcion buscar mediante "id", lo pusheo a mi array "carrito" y luego lo guardo en LS "carrito"
const agregarAlCarrito = (id) => {
    const carrito = obtenerCarritoLS();
    let producto = buscarProducto(id, cargarProdEnLS());
    if (existeEnCarrito(id)) {
        let producto = carrito.find(item => item.id === id);
        producto.cantidadSolicitada++;
    } else {
        let producto = buscarProducto(id, cargarProdEnLS());
        producto.cantidadSolicitada = 1;
        producto.agregadoAlCarrito = true;
        carrito.push(producto);
    }

    Toastify({
        text: `Agregaste ${producto.title} al carrito`,
        duration: 2000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();

    guardarCarritoLS(carrito);
    numProdCarrito()
}

// Realizo un render de mis productos en la LS "carrito" para mostrarlos
const renderCarrito = () => {
    const prodCarrito = obtenerCarritoLS();
    let renderCarrito = "";
    let contenidoCarrito = document.getElementById("contenidoCarrito");
    let divCarrito = document.getElementById("botones");
    if (prodCarrito.length >= 1) {
        let order = 1;
        renderCarrito = `<h2>Sus productos</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Imagen</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Subtotal</th>
                        <th scope="col">Eliminar</th>
                    </tr>
                </thead>`
        prodCarrito.forEach(prod => {
            renderCarrito +=
                `<tbody>
                    <tr>
                        <th scope="row">${order++}</th>
                        <td><img src="${prod.image}" alt="${prod.title}" width="50"></td>
                        <td>${prod.title}</td>
                        <td><input id="artSolicitados${prod.id}" type ="number" onChange="agregarDedeCarrito(${prod.id})" value="${prod.cantidadSolicitada}" min="1"></td>
                        <td>$${prod.ivaIncluido.toFixed(2)}</td>
                        <td>$${(prod.ivaIncluido * prod.cantidadSolicitada).toFixed(2)}</td>
                        <td><button id="btnEliminar" type="button" class="btn-close" aria-label="Close" onclick="eliminarDelCarrito(${prod.id})"></button></td>
                    </tr>
                </tbody>`
        })
        renderCarrito += `</table>`;
        contenidoCarrito.innerHTML = renderCarrito;



        divCarrito.innerHTML =
            `<button type="button" class="btn btn-outline-danger" onclick="vaciarCarritoSwAl()">Vaciar Carrito</button>
        <button type="button" class="btn btn-outline-success" onclick="finalizarCompraSwAl()">Finalizar Compra!</button>`

        numProdCarrito()
    } else {
        contenidoCarrito.innerHTML = `<div class="alert alert-danger text-center" role="alert">
        Tu carrito esta vacio!
      </div>`
        divCarrito.innerHTML = "";
    }
}

const existeEnCarrito = (id) => {
    const producto = obtenerCarritoLS();
    let prod = producto.find(producto => producto.id === id);
    if (prod) {
        return prod.agregadoAlCarrito
    }
}

// Funcion para mostrar la cantidad de productos seleccionados en el icono del carrito
const numProdCarrito = () => {
    let nProdCarrito = document.getElementById("nProdCarrito");
    let prodCarrito = obtenerCarritoLS()
    return nProdCarrito.innerHTML = prodCarrito.reduce((acumulador, item) => acumulador += item.cantidadSolicitada, 0)
}
numProdCarrito();

// Funcion para eliminar un producto del carrito
const eliminarDelCarrito = (id) => {
    let carrito = obtenerCarritoLS();
    nuevoCarrito = carrito.filter(item => item.id !== id)
    guardarCarritoLS(nuevoCarrito);
    numProdCarrito();
    renderCarrito();
}

// Funcion para agregar producto a carrito
const agregarDedeCarrito = (id) => {
    const carrito = obtenerCarritoLS();
    let producto = carrito.find(item => item.id === id);
    let carritoValue = document.getElementById("artSolicitados" + producto.id)

    if (carritoValue.value >= 1) {
        producto.cantidadSolicitada = parseInt(carritoValue.value)
        guardarCarritoLS(carrito);
        numProdCarrito()
        renderCarrito()
    } else {
        eliminarDelCarrito(id)
    }
}

//Funcion para vaciar todo el carrito
const vaciarCarritoSwAl = () => {
    Swal.fire({
        title: '¿Quieres eliminar tu carrito?',
        text: "Todos tus productos se perderan",
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carrito");
            numProdCarrito();
            renderCarrito();
            Swal.fire(
                'Eliminado!',
                'Tu carrito fue eliminado',
                'success'
            )
        }
    })
}

// Funcion para confirmar compra
const finalizarCompraSwAl = () => {
    Swal.fire({
        title: '¿Quieres confirmar tu compra?',
        icon: 'question',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Confirmado!',
                'Tu carrito fue procesado',
                'success'
            );
            location.href = './pago.html';
        }
    })
}

// Renderizo los calculos de compra
const renderCalculos = () => {
    let productosDelCarrito = obtenerCarritoLS();

    function totalProductosFUN() {
        return productosDelCarrito.reduce((acumulador, item) => acumulador += item.cantidadSolicitada, 0);
    }

    function netoFUN() {
        return productosDelCarrito.reduce((acumulador, item) => acumulador += item.price * item.cantidadSolicitada, 0)
    }

    function calcularIVAFUN() {
        return productosDelCarrito.reduce((acumulador, item) => acumulador += item.montoIVA * item.cantidadSolicitada, 0)
    }

    function subtotalFUN() {
        return subtotalTabla = netoFUN() + calcularIVAFUN();
    }

    function aplicarDescuentoFUN() {
        let dcto = 10;
        let cantidadDcto = 10;
        let precioDcto = 10000;
        let aplicarDescuento = 0;
        if ((totalProductosFUN() >= cantidadDcto) || (subtotalFUN() >= precioDcto)) {
            aplicarDescuento = subtotalFUN() * (dcto / 100);
        }
        return aplicarDescuento;
    }

    function totalFinalFUN() {
        return finalAPagarTabla.innerHTML = subtotalFUN() - aplicarDescuentoFUN()
    }

    let totalProductos = document.getElementById("cantDeProductosID");
    totalProductos.innerHTML = totalProductosFUN()

    let totalNetoTabla = document.getElementById("netoID");
    totalNetoTabla.innerHTML = "$" + netoFUN().toFixed(2);

    let subtotalIVATabla = document.getElementById("ivaID");
    subtotalIVATabla.innerHTML = "$" + calcularIVAFUN().toFixed(2);

    let subtotalTabla = document.getElementById("subtotalID");
    subtotalTabla.innerHTML = "$" + subtotalFUN().toFixed(2);

    let descuentoTabla = document.getElementById("descuentoID");
    descuentoTabla.innerHTML = "$" + aplicarDescuentoFUN().toFixed(2);

    let finalAPagarTabla = document.getElementById("totalID");
    finalAPagarTabla.innerHTML = "$" + totalFinalFUN().toFixed(2);

}

//Creo una nueva LS para renderizar item completo
const guardarItemLS = (id) => {
    localStorage.setItem("item", JSON.stringify(id));
}

// Obtengo productos de mi LS para mostrar item completo
const obtenerItemLS = () => {
    return JSON.parse(localStorage.getItem("item")) || [];
}

//
const renderItem = () => {
    const producto = buscarProducto(obtenerItemLS(), cargarProdEnLS())

    document.getElementById("imgItem").src = producto.image
    document.getElementById("nombreItem").innerHTML = producto.title +"<br>"+"<br>"
    document.getElementById("descripcionItem").innerHTML = producto.description + "<br>"+"<br>"
    document.getElementById("precioItem").innerHTML = "$" + producto.ivaIncluido.toFixed(2) +"<br>"+"<br>"
    document.getElementById("btnItem").innerHTML = `<a class="btn btn-outline-success" onClick="agregarAlCarrito(${producto.id})" id="btnItem">Sumar al carrito</a>`
}