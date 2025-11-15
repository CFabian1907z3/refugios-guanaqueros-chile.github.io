/* ╔═══════════════════════════════════════════════════════════╗
║  FORMULARIO DE CONTACTO - VERSIÓN MAILTO: CON FORMATO     ║
║  ────────────────────────────────────────────────────────  ║
║  Este script recolecta los datos del formulario, los       ║
║  formatea de forma legible y abre el cliente de correo.    ║
╚═══════════════════════════════════════════════════════════╝
*/

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const toggleButton = document.getElementById('toggle-details');
    const additionalDetails = document.getElementById('additional-details');
    const toggleIcon = document.getElementById('toggle-icon');

    // Email de destino fijo
    const TO_EMAIL = 'contacto@refugiodeguanaqueros.cl';
    const SUBJECT = 'Nueva Solicitud Web de Refugio';

    // ========== GESTIÓN DE SECCIÓN EXPANDIBLE ==========
    if (toggleButton && additionalDetails && toggleIcon) {
        toggleButton.addEventListener('click', function() {
            const isHidden = additionalDetails.classList.contains('hidden');
            
            if (isHidden) {
                additionalDetails.classList.remove('hidden');
                toggleIcon.classList.add('rotate-90');
            } else {
                additionalDetails.classList.add('hidden');
                toggleIcon.classList.remove('rotate-90');
            }
        });
    }

    // ========== ENVÍO CON FORMATO MAILTO: (Versión final) ==========
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Detiene el envío HTTP por defecto

            // 1. Recolección y Formateo de Datos
            let bodyContent = "--- DATOS DEL SOLICITANTE ---\n";

            // Recoger campos principales
            const name = document.getElementById('name').value || "No especificado";
            const email = document.getElementById('email').value || "No especificado";
            const phone = document.getElementById('phone').value || "No especificado";
            const message = document.getElementById('message').value || "Sin mensaje adicional";

            // Construir el mensaje principal
            bodyContent += `Nombre: ${name}\n`;
            bodyContent += `Correo: ${email}\n`;
            bodyContent += `Teléfono: ${phone}\n\n`;

            // 2. Recoger detalles adicionales (Reserva)
            const persons = document.getElementById('persons').value;
            const cabinType = document.getElementById('cabin-type').value;
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            
            // Si el usuario llenó AL MENOS un campo de reserva, incluimos la sección
            if (persons || cabinType || checkIn || checkOut) {
                bodyContent += "--- DETALLES DE LA SOLICITUD DE RESERVA ---\n";
                bodyContent += `Número de personas: ${persons || "No especificado"}\n`;
                bodyContent += `Tipo de cabaña: ${cabinType || "No especificado"}\n`;
                bodyContent += `Fecha de Llegada: ${checkIn || "No especificado"}\n`;
                bodyContent += `Fecha de Salida: ${checkOut || "No especificado"}\n\n`;
            }

            // Añadir el mensaje de texto al final
            bodyContent += "--- MENSAJE DEL USUARIO ---\n";
            bodyContent += message;
            
            // 3. Codificar el mensaje para la URL (clave para el mailto)
            const encodedBody = encodeURIComponent(bodyContent);
            const encodedSubject = encodeURIComponent(SUBJECT);
            
            // 4. Construir el enlace final de mailto:
            // Usamos 'cc' para enviar una copia al cliente (si quieres) o 'to' para el cliente.
            const mailtoLink = `mailto:${TO_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;

            // 5. Abrir el cliente de correo
            window.location.href = mailtoLink;
            
            // 6. Mensaje de éxito simulado (opcional, ya que el navegador redirige)
            // Se recomienda quitar el div #form-success del HTML si lo usas con mailto
            // para evitar confusiones.
            // alert("El formulario se abrirá en tu cliente de correo. ¡Debes hacer clic en ENVIAR en esa ventana!");

        });
    }
    
    console.log('📬 Formulario de contacto inicializado con método MAILTO: formateado.');
    console.log('📧 Email destino:', TO_EMAIL);
});