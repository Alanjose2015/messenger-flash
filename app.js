document.addEventListener("DOMContentLoaded", function() {
    const nombreInput = document.getElementById("nombre");
    const tipoEnvioSelect = document.getElementById("tipoEnvio");
    const origenInput = document.getElementById("origen");
    const destinoInput = document.getElementById("destino");
    const btnCalcular = document.getElementById("btnCalcular");
    const btnWhatsApp = document.getElementById("btnWhatsApp");
    const txtPrecio = document.getElementById("txtPrecio");
    const statusContainer = document.getElementById("statusContainer");
    const priceDisplay = document.getElementById("priceDisplay");
    const recargosDisplay = document.getElementById("recargosDisplay");

    const NUMERO_WHATSAPP = "5493815727447";
    const TARIFA_BASE = 1000;
    const PRECIO_POR_KM = 800;
    const EXTRA_ZONA_ROJA = 500;

    // Función para estimar distancia basada en palabras clave
    function estimarKilometros(orig, dest) {
        const texto = (orig + " " + dest).toLowerCase();
        if (texto.includes("aconquija") && (texto.includes("centro") || texto.includes("roca") || texto.includes("jujuy") || texto.includes("uruguay"))) return 8.2;
        if (texto.includes("jujuy") && texto.includes("uruguay")) return 2.7;
        if (texto.includes("banda") || texto.includes("talitas") || texto.includes("aldelertes")) return 6.5;
        if (texto.includes("aconquija") && (texto.includes("solano") || texto.includes("peron"))) return 4.5;
        return 3.5; // Distancia por defecto
    }

    // Función para detectar zonas de riesgo
    function esZonaRoja(orig, dest) {
        const texto = (orig + " " + dest).toLowerCase();
        return texto.includes("san javier") || texto.includes("banda") || texto.includes("talitas") || texto.includes("tafí viejo");
    }

    function calcularPrecio() {
        const nombre = nombreInput.value.trim();
        const tipoEnvio = tipoEnvioSelect.value;
        const origen = origenInput.value.trim();
        const destino = destinoInput.value.trim();

        // Validaciones
        if (!nombre) { alert("Por favor, ingresa tu nombre completo."); return; }
        if (!tipoEnvio) { alert("Por favor, selecciona el tipo de envío."); return; }
        if (!origen || !destino) { alert("Por favor, ingresa origen y destino para cotizar."); return; }

        const km = estimarKilometros(origen, destino);
        let costo = TARIFA_BASE + (km * PRECIO_POR_KM);
        
        // Lógica de recargos dinámicos
        const hora = new Date().getHours();
        const dia = new Date().getDay();
        let multiplicador = 1.0;
        let badges = [];

        // 1. Recargo Nocturno (22:00 a 06:00)
        if (hora >= 22 || hora < 6) {
            multiplicador += 0.30;
            badges.push({ text: "🌙 Nocturno", class: "warning" });
        }

        // 2. Alta Demanda (Fin de semana o Hora punta 18:00-22:00 o aleatorio)
        const esFinDeSemana = (dia === 0 || dia === 6);
        const esHoraPunta = (hora >= 18 && hora < 22);
        
        if (esFinDeSemana || esHoraPunta || Math.random() < 0.3) {
            multiplicador += 0.50;
            badges.push({ text: "🌧️ Alta Demanda", class: "active" });
        }

        // 3. Zona Roja (Extra fijo)
        if (esZonaRoja(origen, destino)) {
            costo += EXTRA_ZONA_ROJA;
            badges.push({ text: "⚠️ Zona Riesgo", class: "warning" });
        }

        // Aplicar multiplicador
        costo = Math.floor(costo * multiplicador);

        // Mostrar resultados
        txtPrecio.textContent = "$" + costo;
        priceDisplay.classList.add("visible");
        recargosDisplay.style.display = "block"; // Mostrar bloque de recargos
        btnWhatsApp.style.display = "block"; // Mostrar botón WhatsApp

        // Mostrar Badges
        statusContainer.innerHTML = badges.map(b => `<div class="status-badge ${b.class}">${b.text}</div>`).join('');
        
        // Preparar mensaje para WhatsApp
        const mensaje = `🚀 *NUEVO PEDIDO - MESSENGER FLASH*\n\n👤 *Cliente:* ${nombre}\n📦 *Tipo:* ${tipoEnvio}\n📍 *Origen:* ${origen}\n🏁 *Destino:* ${destino}\n💰 *Estimado:* $${costo}\n\n*Nota:* El precio final puede variar por clima/traslados.`;
        
        btnWhatsApp.onclick = () => {
            const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        };
    }

    btnCalcular.addEventListener("click", calcularPrecio);
});
