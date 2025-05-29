// main.js - Funcionalidad principal de la página web

document.addEventListener('DOMContentLoaded', () => {
    // --- Manejo del menú hamburguesa para navegación móvil ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav');

    // Función para alternar la visibilidad del menú
    const toggleMenu = () => {
        hamburger.classList.toggle('is-active'); // Cambia el icono de hamburguesa a cruz
        navMenu.classList.toggle('is-active');   // Muestra/oculta el menú de navegación
        // Deshabilita el scroll del cuerpo cuando el menú está abierto
        document.body.style.overflow = navMenu.classList.contains('is-active') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Cierra el menú cuando se hace clic en un enlace (para móviles)
    document.querySelectorAll('.nav ul li a').forEach(item => {
        item.addEventListener('click', () => {
            if (navMenu.classList.contains('is-active')) {
                toggleMenu();
            }
        });
    });

    // --- Smooth Scrolling para enlaces de anclaje (navegación interna) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Evita el comportamiento predeterminado del enlace

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth' // Desplazamiento suave
            });
        });
    });

    // --- (OPCIONAL) Efecto de "Sticky Header" - Añadir sombra al hacer scroll ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Si el scroll es mayor a 50px
            header.classList.add('scrolled'); // Añade una clase 'scrolled'
        } else {
            header.classList.remove('scrolled'); // Elimina la clase
        }
    });

    // Añadir estilo CSS para la clase 'scrolled' en style.css:
    /*
    .header.scrolled {
        background-color: var(--white);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }
    */

    // --- Implementación básica de la Emisora Comunitaria ---
    // NOTA: Esto es un reproductor HTML5 básico. Para una emisora online real,
    // necesitarías un servicio de streaming de audio y podrías integrar un iframe
    // o usar una librería JS específica para streaming.

    const playRadioBtn = document.getElementById('playRadio');
    const radioAudio = document.querySelector('.community-radio audio'); // Asume que ya tienes el <audio>

    if (playRadioBtn && radioAudio) {
        playRadioBtn.addEventListener('click', () => {
            if (radioAudio.paused) {
                radioAudio.play();
                playRadioBtn.textContent = 'Pausar Emisora';
            } else {
                radioAudio.pause();
                playRadioBtn.textContent = 'Reproducir Emisora';
            }
        });

        // Opcional: Actualizar el botón si el audio termina o se pausa externamente
        radioAudio.addEventListener('pause', () => {
            playRadioBtn.textContent = 'Reproducir Emisora';
        });
        radioAudio.addEventListener('ended', () => {
            playRadioBtn.textContent = 'Reproducir Emisora';
        });
    }

    // --- Funcionalidad del Formulario de Apoyo Jurídico (Ejemplo básico) ---
    const legalForm = document.querySelector('.legal-form');
    if (legalForm) {
        legalForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Detiene el envío del formulario por defecto

            // Aquí deberías integrar un servicio de backend (como Formspree, Netlify Forms, etc.)
            // para recibir los datos del formulario de forma segura.
            // Por ahora, solo mostramos un mensaje de confirmación.

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const topic = document.getElementById('topic').value;

            alert(`Gracias, ${name}! Tu solicitud de apoyo jurídico sobre "${topic}" ha sido enviada. Te contactaremos pronto al correo ${email}.`);

            // Limpia el formulario
            this.reset();
        });
    }
});