/**
 * REPOSITORIO: Messenger-flash
 * DESCRIPCIÓN: Cotizador en tiempo real basado en kilometraje con bloqueo de campos vacíos.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 📞 CONFIGURACIÓN CENTRAL
    const NUMERO_WHATSAPP = "5493815555555"; // ⚠️ REEMPLAZÁ CON TU TELÉFONO REAL

    // 💰 MATRIZ DE TARIFAS REALES ACTUALIZADAS A TUCUMÁN
    const TARIFA_BASE = 900;       // Costo inicial (bajada de bandera)
    const PRECIO_POR_KM = 450;     // Valor por kilómetro

    // ⚙️ ELEMENTOS DE LA INTERFAZ
    const origenInput = document.getElementById("origen");
    const destinoInput = document.getElementById("destino");
    const chkLluvia = document.getElementById("chkLluvia");
    const chkNocturno = document.getElementById("chkNocturno");
    const btnCalcular = document.getElementById("btnCalcular");
    const txtPrecio = document.getElementById("txtPrecio");
    const btnWhatsApp = document.getElementById("btnWhatsApp");

    let precioFinalCalculado = 0;

    /**
     * Motor de estimación de distancias reales en Tucumán
     */
    function estimarKilometros(orig, dest) {
        const texto = (orig + " " + dest).toLowerCase().trim();
        
        if (!orig || !dest) return 0;

        // Caso Jujuy / Uruguay (Aprox 2.7 km)
        if ((texto.includes("jujuy") && texto.includes("uruguay")) || 
            (texto.includes("uruguay") && texto.includes("jujuy"))) {
            return 2.7;
        }

        // Yerba Buena / Avenidas principales
        if (texto.includes("yerba buena") || texto.includes("peron") || texto.includes("aconquija") || texto.includes("solano vera")) {
            return 8.5;
        }

        // Municipios vecinos
        if (texto.includes("banda") || texto.includes("talitas") || texto.includes("alderetes")) {
            return 6.2;
        }

        // Trayecto genérico base dentro de San Miguel
        return 3.5;
    }

    /**
     * Función Principal con Control de Vacíos
     */
    function calcularTarifaDinamica() {
        const origen = origenInput.value.trim();
        const destino = destinoInput.value.trim();

        // Si alguno de los dos campos está vacío, el precio se resetea a $0
        if (origen === "" || destino === "") {
            txtPrecio.textContent = "$0"; 
            precioFinalCalculado = 0;
            return; 
        }

        // Calcular según los kilómetros si ambos campos tienen texto
        const kilometros = estimarKilometros(origen, destino);
        let costoSubtotal = TARIFA_BASE + (kilometros * PRECIO_POR_KM);

        // Multiplicadores de Tarifa Dinámica (Estilo Uber)
        let multiplicador = 1.0;

        if (chkLluvia.checked) {
            multiplicador += 0.50; // +50% por lluvia (complicado conseguir moto)
        }
        if (chkNocturno.checked) {
            multiplicador += 0.30; // +30% tarifa nocturna
        }

        // Aplicar redondeo a múltiplos de $50 para el cambio físico
        let calculoMatematico = costoSubtotal * multiplicador;
        precioFinalCalculado = Math.round(calculoMatematico / 50) * 50;

        if (precioFinalCalculado < TARIFA_BASE) {
            precioFinalCalculado = TARIFA_BASE;
        }

        // Mostrar el precio real calculado en el neón verde
        txtPrecio.textContent = `$${precioFinalCalculado}`;
    }

    /**
     * Envío a WhatsApp verificado
     */
    function enviarPedidoWhatsApp() {
        const origen = origenInput.value.trim();
        const destino = destinoInput.value.trim();
        
        if (origen === "" || destino === "") {
            alert("Por favor, ingresá las direcciones completas antes de solicitar el cadete.");
            return;
        }

        let estadoClima = chkLluvia.checked ? "🌧️ Lluvia / Alta Demanda" : "☀️ Normal";
        let estadoHorario = chkNocturno.checked ? "🌙 Nocturno" : "☀️ Diurno";
        const kms = estimarKilometros(origen, destino);

        const mensaje = encodeURIComponent(
            `*⚡ NUEVO PEDIDO - MESSENGER-FLASH ⚡*\n\n` +
            `📍 *Origen (Retiro):* ${origen}\n` +
            `🏁 *Destino (Entrega):* ${destino}\n\n` +
            `📊 *Detalles del viaje:*\n` +
            `- Recorrido apróx: ~${kms} km\n` +
            `- Estado Clima: ${estadoClima}\n` +
            `- Horario: ${estadoHorario}\n\n` +
            `💵 *COSTO ESTIMADO:* $${precioFinalCalculado}\n\n` +
            `_Por favor, confírmenme los datos de pago para iniciar._`
        );

        window.open(`https://whatsapp.com{NUMERO_WHATSAPP}&text=${mensaje}`, "_blank");
    }

    // --- ESCUCHADORES DE EVENTOS EN TIEMPO REAL ---
    origenInput.addEventListener("input", calcularTarifaDinamica);
    destinoInput.addEventListener("input", calcularTarifaDinamica);
    chkLluvia.addEventListener("change", calcularTarifaDinamica);
    chkNocturno.addEventListener("change", calcularTarifaDinamica);
    btnCalcular.addEventListener("click", calcularTarifaDinamica);
    btnWhatsApp.addEventListener("click", enviarPedidoWhatsApp);

    // Inicializa en $0 al cargar por primera vez
    calcularTarifaDinamica();
});
