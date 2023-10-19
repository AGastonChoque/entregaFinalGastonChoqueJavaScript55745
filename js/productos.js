// Declaro array de productos
const productosIluminacion = []
const productosAdhesivos = []
const productosAPI = []

// Creo productos iluminacion (Objetos)
const prod11 = { id: 21, title: "Lampara 9W", price: 700, iva: 10.5, image: "../resources/products/lamp9.jpg", description: "Lampara LED Rosca Comun 9w Fría o Cálida tiene 6 cm de diámetro y 10,9 cm de altura total.Estas lamparas NO son dimerizables" };
const prod12 = { id: 22, title: "Lampara 12W", price: 800, iva: 10.5, image: "../resources/products/lamp12.jpg", description: "Lampara LED Rosca Comun 12w Fría o Cálida tiene 6 cm de diámetro y 10,9 cm de altura total.Estas lamparas NO son dimerizables" };
const prod13 = { id: 23, title: "Lampara 15W", price: 900, iva: 10.5, image: "../resources/products/lamp15.jpg", description: "Lampara LED Rosca Comun 15w Fría o Cálida tiene 6 cm de diámetro y 10,9 cm de altura total.Estas lamparas NO son dimerizables" };
const prod14 = { id: 24, title: "Lampara 10w Smart", price: 4500, iva: 21, image: "../resources/products/lamp10smart.jpg", description: "Lamapra LED SMART (inteligente), controla tu iluminacion de manera eficiente y estes donde estes, crea escenas, cambia el color y intensidad" };
const prod15 = { id: 25, title: "Guirnalda 5Mts", price: 5000, iva: 21, image: "../resources/products/guirnalda5.jpg", description: "Guirnalda de 5 metros, incluye lamapras led tipo gota de 6w, frias o calidas a eleccion (Separacion de las lamapras 1M)" };
const prod16 = { id: 26, title: "Guirnalda 10Mts", price: 10000, iva: 21, image: "../resources/products/guirnalda10.jpg", description: "Guirnalda de 10 metros, incluye lamapras led tipo gota de 6w, frias o calidas a eleccion (Separacion de las lamapras 1M)" };

// Creo productos adhesivos (Objetos)
const prod17 = { id: 27, title: "Eccole", price: 1000, iva: 21, image: "../resources/products/eccole.jpg", description: "¿Qué es ÉCCOLE ®? Es un adhesivo para zapatillas de consistencia tipo gel, transparente y fácil de usar. en zapatillas: cuero, tela y ciertos materiales plásticos." };
const prod18 = { id: 28, title: "La gotita", price: 600, iva: 21, image: "../resources/products/gotita.jpg", description: "La gotita® es el pegamento instantáneo que forma parte de la caja de herramientas de todos los hogares por su practicidad, efectividad y excelencia." };

//Creo una clase constructor de productos a partir de un objeto
class nuevoProducto {
    constructor(producto) {
        this.id = producto.id;
        this.title = producto.title;
        this.description = producto.description
        this.price = (producto.price);
        this.IVA = (producto.iva);
        this.image = producto.image
        this.montoIVA = (this.price * this.IVA / 100);
        this.ivaIncluido;
        this.agregadoAlCarrito = false;
    }
    aplicarIVA() {
        return this.ivaIncluido = (this.price + this.montoIVA);
    }
};

// Creo nuevmaente los productos a partir de una clase y luego los pusheo a el array correspondiente
productosIluminacion.push(new nuevoProducto(prod11))
productosIluminacion.push(new nuevoProducto(prod12))
productosIluminacion.push(new nuevoProducto(prod13))
productosIluminacion.push(new nuevoProducto(prod14))
productosIluminacion.push(new nuevoProducto(prod15))
productosIluminacion.push(new nuevoProducto(prod16))
productosAdhesivos.push(new nuevoProducto(prod17))
productosAdhesivos.push(new nuevoProducto(prod18))

// Spinner de carga
const renderSpinner = () => {
    let spinner = `<div class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`
    let contenidoProductos = document.getElementById("contenidoProductos");
    contenidoProductos.innerHTML = spinner
}
renderSpinner()


// Traigo/Consumo API para obtener algunos productos los pusheo a mi array productosAPI
let productosALaVenta = []
const API = () => {
    fetch('https://fakestoreapi.com/products?limit=10')
        .then(res => res.json())
        .then(json => {
            json.forEach(el => {
                el.iva = 21
                productosAPI.push(new nuevoProducto(el))
            })

            // Concateno ambos arrays para crear un solo array de productos a la venta
            productosALaVenta = productosAPI.concat(productosIluminacion, productosAdhesivos)

            // Ejecuto la funcion aplicar iva para que la propiedad ivaIncluido quede lista, ya que si la quiero ejecutar despues de parsear no me deja hacerlo
            for (const prod of productosALaVenta) {
                prod.aplicarIVA();
            }
            guardarProdEnLS(productosALaVenta)
            renderProductos()
        })
        .catch(error => {
            let mensajeError = `<div class="alert alert-danger text-center" role="alert">
            Tenemos un problema pero lo estamos resolviendo, vuelve mas tarde por favor <3 <br>${error}
            </div>`;

            let contenidoProductos = document.getElementById("contenidoProductos");
            contenidoProductos.innerHTML = mensajeError
        })
}
API()