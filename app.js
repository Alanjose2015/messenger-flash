/**
 * REPOSITORIO: Messenger-flash
 * DESCRIPCIÓN: Cotizador con códigos secretos de tarifa dinámica ocultos para el desarrollador.
 */

document.addEventListener("DOMContentLoaded", () => {
    const NUMERO_WHATSAPP = "5493815555555"; // ⚠️ REEMPLAZÁ CON TU TELÉFONO REAL

    const TARIFA_BASE = 750;       
    const PRECIO_POR_KM = 350;     

    const origenInput = document.getElementById("origen");
    const destinoInput = document.getElementById("destino");
    const btnCalcular = document.getElementById("btnCalcular");
    const txtPrecio = document.getElementById("txtPrecio");
    const btnWhatsApp = document.getElementById("btnWhatsApp");

    let precioFinalCalculado = 0;

    function estimarKilometros(orig, dest) {
        const texto = (orig + " " + dest).toLowerCase().trim();
        
        if (!orig || !dest) return 0;

        if ((texto.includes("jujuy") && texto.includes("uruguay")) || 
            (texto.includes("uruguay") && texto.includes("jujuy"))) {
            return 2.7;
        }
        if (texto.includes("yerba buena") || texto.includes("peron") || texto.includes("aconquija") || texto.includes("solano vera")) {
            return 8.5;
        }
        if (texto.includes("banda") || texto.includes("talitas") || texto.includes("alderetes")) {
            return 6.2;
        }
        return 3.5;
    }

    function calcularTarifaDinamica() {
        // Obtenemos los textos en bruto para buscar los comandos ocultos
        const origenCrudo = origenInput.value;
        const destinoCrudo = destinoInput.value;

        // Limpiamos los textos quitando los códigos secretos para hacer el cálculo limpio de direcciones
        const origen = origenCrudo.replace("+lluvia", "").replace("+noche", "").trim();
        const destino = destinoCrudo.replace("+lluvia", "").replace("+noche", "").trim();

        if (origen === "" || destino === "") {
            txtPrecio.textContent = "$0"; 
            precioFinalCalculado = 0;
            return; 
        }

        const kilometros = estimarKilometros(origen, destino);
        let costoSubtotal = TARIFA_BASE + (kilometros * PRECIO_POR_KM);

        // 🕵️‍♂️ LÓGICA OCULTA: Verifica si pusiste los comandos secretos en los inputs
        let multiplicador = 1.0;
        const textoCompletoConCodigos = (origenCrudo + " " + destinoCrudo).toLowerCase();

        if (textoCompletoConCodigos.includes("+lluvia")) {
            multiplicador += 0.50; // +50% por lluvia
        }
        if (textoCompletoConCodigos.includes("+noche")) {
            multiplicador += 0.30; // +30% nocturno
        }

        let calculoMatematico = costoSubtotal * multiplicador;
        precioFinalCalculado = Math.round(calculoMatematico / 50) * 50;

        if (precioFinalCalculado < TARIFA_BASE) {
            precioFinalCalculado = TARIFA_BASE;
        }

        txtPrecio.textContent = `$${precioFinalCalculado}`;
    }

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

    origenInput.addEventListener("input", calcularTarifaDinamica);
    destinoInput.addEventListener("input", calcularTarifaDinamica);
    btnCalcular.addEventListener("click", calcularTarifaDinamica);
    btnWhatsApp.addEventListener("click", enviarPedidoWhatsApp);

    calcularTarifaDinamica();
});
