// Constantes de configuración para la tarifa
const TARIFA_BASE = 500;
const PRECIO_POR_CUADRA = 50; 
const TELEFONO_WHATSAPP = "5493815727447"; // Su número configurado sin el símbolo '+'

// Elementos del DOM
const inputOrigen = document.getElementById('origen');
const inputDestino = document.getElementById('destino');
const btnCalcular = document.getElementById('btnCalcular');
const btnWhatsApp = document.getElementById('btnWhatsApp');
const txtPrecio = document.getElementById('txtPrecio');

// Variable global para almacenar el último precio calculado
let precioCalculado = 0;

// Función para simular el cálculo de costo de envío
function calcularCosto() {
    const origen = inputOrigen.value.trim();
    const destino = inputDestino.value.trim();

    if (origen === "" || destino === "") {
        alert("Por favor, completa ambas direcciones para calcular el costo.");
        return;
    }

    // Simulación: Genera un costo aleatorio basado en una tarifa base
    // En producción, aquí integrarías la API de Google Maps Matrix
    const cuadrasEstimadas = Math.floor(Math.random() * 25) + 5; 
    precioCalculado = TARIFA_BASE + (cuadrasEstimadas * PRECIO_POR_CUADRA);

    // Actualiza el precio en la interfaz con formato de moneda
    txtPrecio.textContent = `$${precioCalculado}`;
}

// Función para redirigir a WhatsApp con los datos del pedido
function enviarWhatsApp() {
    const origen = inputOrigen.value.trim();
    const destino = inputDestino.value.trim();

    if (origen === "" || destino === "") {
        alert("Primero debes ingresar las direcciones de origen y destino.");
        return;
    }

    if (precioCalculado === 0) {
        alert("Por favor, presiona el botón 'Calcular Costo Ahora' antes de solicitar.");
        return;
    }

    // Estructura del mensaje para el operador de la base
    const mensaje = `Olá Messenger-flash! 🏍️💨\n\n` +
                    `Quiero solicitar un envío con los siguientes detalles:\n` +
                    `📍 *Origen:* ${origen}\n` +
                    `🏁 *Destino:* ${destino}\n` +
                    `💵 *Costo Estimado:* $${precioCalculado}\n\n` +
                    `¿Me confirman la disponibilidad del cadete?`;

    // Codifica el texto para que sea válido en una URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crea el enlace final de WhatsApp
    const urlWhatsApp = `https://wa.me{TELEFONO_WHATSAPP}?text=${mensajeCodificado}`;

    // Abre WhatsApp en una nueva pestaña
    window.open(urlWhatsApp, '_blank');
}

// Asignación de eventos a los botones
btnCalcular.addEventListener('click', calcularCosto);
btnWhatsApp.addEventListener('click', enviarWhatsApp);
        
