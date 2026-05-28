// CONFIGURACIÓN DE TU NEGOCIO
const TELEFONO_KDT = "5493815555555"; // Pon aquí el número real de tu cadetería
const PRECIO_BASE = 400;              // Precio base por salir
const PRECIO_POR_KM = 250;            // Precio por kilómetro en Tucumán

function activarConfiguracionApp() {
    const configuracionJSON = {
        "short_name": "Flash Messenger",
        "name": "MESSENGER FLASH - Cadetería",
        "icons": [{
            "src": "https://flaticon.com",
            "type": "image/png",
            "sizes": "512x512"
        }],
        "start_url": ".",
        "display": "standalone",
        "orientation": "portrait",
        "background_color": "#1e293b",
        "theme_color": "#1e293b"
    };
    const blob = new Blob([JSON.stringify(configuracionJSON)], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(blob);
    const linkManifest = document.createElement('link');
    linkManifest.rel = 'manifest';
    linkManifest.href = manifestURL;
    document.head.appendChild(linkManifest);
}

function inicializarApp() {
    activarConfiguracionApp();

    const inputOrigen = document.getElementById('origen');
    const inputDestino = document.getElementById('destino');
    const btnManual = document.getElementById('btn-calcular-manual');

    if (inputOrigen) inputOrigen.addEventListener('input', calcularRutaYPrecio);
    if (inputDestino) inputDestino.addEventListener('input', calcularRutaYPrecio);
    if (btnManual) btnManual.addEventListener('click', calcularRutaYPrecio);

    calcularRutaYPrecio();
}

async function buscarCoordenadas(direccion) {
    if (!direccion) return null;
    try {
        const url = `https://openstreetmap.org{encodeURIComponent(direccion + ', San Miguel de Tucumán, Argentina')}&limit=1`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        if (datos && datos.length > 0) {
            return [parseFloat(datos.lat), parseFloat(datos.lon)];
        }
    } catch (error) {
        console.error("Error al conectar con el servidor satelital:", error);
    }
    return null;
}

async function calcularRutaYPrecio() {
    const txtOrigen = document.getElementById('origen').value.trim();
    const txtDestino = document.getElementById('destino').value.trim();
    const elementoPrecio = document.getElementById('precioEstimado');

    if (!txtOrigen || !txtDestino) {
        if (elementoPrecio) elementoPrecio.textContent = "$0";
        return;
    }

    const coordsOrigen = await buscarCoordenadas(txtOrigen);
    const coordsDestino = await buscarCoordenadas(txtDestino);

    if (coordsOrigen && coordsDestino) {
        const distanciaKm = medirDistanciaLineal(coordsOrigen, coordsOrigen, coordsDestino, coordsDestino);
        const costoFinal = Math.round(PRECIO_BASE + (distanciaKm * PRECIO_POR_KM));

        if (elementoPrecio) elementoPrecio.textContent = `$${costoFinal}`;
        actualizarEnlaceWhatsApp(txtOrigen, txtDestino, costoFinal);
    } else {
        const costoFijo = PRECIO_BASE + 450;
        if (elementoPrecio) elementoPrecio.textContent = `$${costoFijo}`;
        actualizarEnlaceWhatsApp(txtOrigen, txtDestino, costoFijo);
    }
}

function medirDistanciaLineal(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function actualizarEnlaceWhatsApp(origen, destino, costo) {
    const botonWhatsApp = document.getElementById('btn-whatsapp');
    if (!botonWhatsApp) return;

    const formatoMensaje = `*NUEVO PEDIDO - MESSENGER FLASH* ⚡🏍\n\n` +
                           `🛫 *RETIRO (Origen):*\n` +
                           `${origen}\n\n` +
                           `🛬 *ENTREGA (Destino):*\n` +
                           `${destino}\n\n` +
                           `💰 *TARIFA ESTIMADA:* $${costo}\n\n` +
                           `_Por favor, confírmenme el servicio y envíenme los datos de pago para confirmar._`;

    botonWhatsApp.onclick = function() {
        const urlLink = `https://wa.me{TELEFONO_KDT}?text=${encodeURIComponent(formatoMensaje)}`;
        window.open(urlLink, '_blank');
    };
}

document.addEventListener("DOMContentLoaded", inicializarApp);
