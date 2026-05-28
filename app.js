/**
 * REPOSITORIO: Messenger-flash
 * DESCRIPCIÓN: Cotizador inteligente por zonas y cuadras de Tucumán sin trabas de $0.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 📞 CONFIGURACIÓN CENTRAL
    const NUMERO_WHATSAPP = "5493815555555"; // ⚠️ REEMPLAZÁ CON TU TELÉFONO REAL

    // 💰 MATRIZ DE TARIFAS EQUILIBRADAS
    const TARIFA_BASE = 750;       // Costo mínimo inicial por viaje
    const PRECIO_POR_KM = 350;     // Precio por kilómetro recorrido (~$35 por cuadra)

    const origenInput = document.getElementById("origen");
    const destinoInput = document.getElementById("destino");
    const btnCalcular = document.getElementById("btnCalcular");
    const txtPrecio = document.getElementById("txtPrecio");
    const btnWhatsApp = document.getElementById("btnWhatsApp");

    let precioFinalCalculado = 0;

    /**
     * Motor Dinámico: Estima los kilómetros reales según las zonas de Tucumán
     */
    function estimarKilometros(orig, dest) {
        const texto = (orig + " " + dest).toLowerCase().trim();
        
        if (!orig || !dest) return 0;

        // 1. VIAJES INTERURBANOS / LARGOS (Ej: Yerba Buena <-> Capital)
        // Si combina Av. Aconquija / Perón con calles de San Miguel (Roca, Centro, etc.)
        if ((texto.includes("aconquija") || texto.includes("peron") || texto.includes("yerba buena")) && 
            (texto.includes("roca") || texto.includes("centro") || texto.includes("jujuy") || texto.includes("uruguay") || texto.includes("alem"))) {
            return 7.8; // Distancia promedio aproximada en kilómetros
        }

        // 2. Viajes internos dentro de Yerba Buena
        if (texto.includes("aconquija") && (texto.includes("solano vera") || texto.includes("fanzolato") || texto.includes("peron"))) {
            return 4.2;
        }

        // 3. CASO DE LA CAPTURA ANTERIOR: Jujuy al 200 <-> Uruguay al 1000
        if (texto.includes("jujuy") && texto.includes("uruguay")) {
            return 2.7;
        }

        // 4. CÁLCULO AUTOMÁTICO POR ALTURA (Para cualquier otra calle de la Capital)
        // Busca los números en las direcciones para estimar las cuadras
        const numeros = texto.match(/\d+/g);
        if (numeros && numeros.length >= 2) {
            const altura1 = parseInt(numeros[0]);
            const altura2 = parseInt(numeros[1]);
            // Calcula la diferencia de cuadras aproximada entre las dos alturas
            const diferenciaCuadras = Math.abs(altura1 - altura2) / 100;
            if (diferenciaCuadras > 0) {
                return Math.max(1.5, diferenciaCuadras); // Mínimo 1.5 km para asegurar rentabilidad
            }
        }

        // 5. Distancia estándar por defecto para viajes urbanos comunes
        return 3.2;
    }

    /**
     * Función Principal de Cálculo
     */
    function calcularTarifaDinamica() {
        const origenCrudo = origenInput.value;
        const destinoCrudo = destinoInput.value;

        // Limpieza de comandos ocultos de desarrollador
        const origen = origenCrudo.replace("+lluvia", "").replace("+noche", "").trim();
        const destino = destinoCrudo.replace("+lluvia", "").replace("+noche", "").trim();

        // Si falta texto en las cajas, se mantiene fijo en $0
        if (origen === "" || destino === "") {
            txtPrecio.textContent = "$0"; 
            precioFinalCalculado = 0;
            return; 
        }

        // Calcular costo por distancia estimada
        const kilometros = estimarKilometros(origen, destino);
        let costoSubtotal = TARIFA_BASE + (kilometros * PRECIO_POR_KM);

        // 🕵️‍♂️ CÓDIGOS SECRETOS: Si agregás +lluvia o +noche al final del texto
        let multiplicador = 1.0;
        const textoCompletoConCodigos = (origenCrudo + " " + destinoCrudo).toLowerCase();

        if (textoCompletoConCodigos.includes("+lluvia")) {
            multiplicador += 0.50; // Tarifa dinámica por lluvia (+50%)
        }
        if (textoCompletoConCodigos.includes("+noche")) {
            multiplicador += 0.30; // Tarifa dinámica nocturna (+30%)
        }

        // Redondeo final limpio a múltiplos de $50
        let calculoMatematico = costoSubtotal * multiplicador;
        precioFinalCalculado = Math.round(calculoMatematico / 50) * 50;

        // Garantizar cobro mínimo de la Tarifa Base
        if (precioFinalCalculado < TARIFA_BASE) {
            precioFinalCalculado = TARIFA_BASE;
        }

        txtPrecio.textContent = `$${precioFinalCalculado}`;
    }

    /**
     * Envío a WhatsApp de la Central
     */
    function enviarPedidoWhatsApp() {
        const origenCrudo = origenInput.value;
        const destinoCrudo = destinoInput.value;
        
        const origen = origenCrudo.replace("+lluvia", "").replace("+noche", "").trim();
        const destino = destinoCrudo.replace("+lluvia", "").replace("+noche", "").trim();

        if (origen === "" || destino === "") {
            alert("Por favor, ingresá las direcciones completas.");
            return;
        }

        const textoCompletoConCodigos = (origenCrudo + " " + destinoCrudo).toLowerCase();
        let estadoClima = textoCompletoConCodigos.includes("+lluvia") ? "🌧️ Lluvia / Alta Demanda" : "☀️ Normal";
        let estadoHorario = textoCompletoConCodigos.includes("+noche") ? "🌙 Nocturno" : "☀️ Diurno";
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

    // --- ESCUCHADORES EN TIEMPO REAL ---
    origenInput.addEventListener("input", calcularTarifaDinamica);
    destinoInput.addEventListener("input", calcularTarifaDinamica);
    btnCalcular.addEventListener("click", calcularTarifaDinamica);
    btnWhatsApp.addEventListener("click", enviarPedidoWhatsApp);

    calcularTarifaDinamica();
});
        
