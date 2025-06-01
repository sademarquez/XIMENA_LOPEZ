// script.js - Lógica JavaScript unificada para la Campaña de Ximena Lopez Yule

document.addEventListener('DOMContentLoaded', function () {
    // --- Lógica para el menú móvil (menú de hamburguesa) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            // Actualizar atributo ARIA para accesibilidad
            const isExpanded = mobileMenu.classList.contains('block');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- Lógica para el desplazamiento suave de los enlaces de navegación ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Cierra el menú móvil después de hacer clic en un enlace
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('block');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // --- Lógica para el Reproductor de Radio ---
    const radioAudio = document.getElementById('radio-audio');
    const playRadioBtn = document.getElementById('play-radio-button');

    if (radioAudio && playRadioBtn) {
        playRadioBtn.addEventListener('click', function() {
            if (radioAudio.paused) {
                radioAudio.play()
                    .then(() => {
                        playRadioBtn.textContent = 'Pausar Emisora';
                    })
                    .catch(error => {
                        console.error('Error al intentar reproducir el audio:', error);
                        alert('No se pudo reproducir el audio. Es posible que el navegador requiera una interacción del usuario primero.');
                    });
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

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const topic = document.getElementById('topic').value;

            alert(`Gracias, ${name}! Tu solicitud de apoyo jurídico sobre "${topic}" ha sido enviada. Te contactaremos pronto al correo ${email}.`);

            this.reset(); // Limpia el formulario
        });
    }

    // --- Lógica para el Carrusel Infinito de Logos ---
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        const carouselItems = Array.from(carouselTrack.children);
        const itemsToDuplicate = carouselItems.length; // Duplicar todos los ítems para un loop suave

        // Duplicar los ítems originales para el efecto infinito
        for (let i = 0; i < itemsToDuplicate; i++) {
            const clone = carouselItems[i].cloneNode(true);
            carouselTrack.appendChild(clone);
        }

        let scrollAmount = 0;
        let animationInterval;
        const scrollSpeed = 0.5; // Pixeles por frame, ajusta para cambiar la velocidad

        // Función para obtener el ancho total de un conjunto de ítems (la "vuelta" original)
        function getOriginalContentWidth() {
            let width = 0;
            for (let i = 0; i < itemsToDuplicate; i++) {
                width += carouselItems[i].offsetWidth;
            }
            return width;
        }

        let originalContentWidth = getOriginalContentWidth();

        // Recalcular ancho si la ventana cambia de tamaño (útil para responsividad)
        window.addEventListener('resize', () => {
            originalContentWidth = getOriginalContentWidth();
            // Asegurarse de que el scrollAmount no exceda el nuevo ancho al reajustar
            if (scrollAmount >= originalContentWidth) {
                scrollAmount = 0;
                carouselTrack.style.transform = `translateX(0px)`;
            }
        });


        function startCarousel() {
            animationInterval = setInterval(() => {
                scrollAmount += scrollSpeed;
                carouselTrack.style.transform = `translateX(-${scrollAmount}px)`;

                // Resetear el scroll cuando llega al final del contenido original
                if (scrollAmount >= originalContentWidth) {
                    scrollAmount = 0; // Vuelve al inicio del contenido original duplicado
                }
            }, 20); // Aproximadamente 50 FPS
        }

        function pauseCarousel() {
            clearInterval(animationInterval);
        }

        // Iniciar el carrusel
        startCarousel();

        // Pausar en hover (solo para desktop)
        carouselTrack.addEventListener('mouseenter', pauseCarousel);
        carouselTrack.addEventListener('mouseleave', startCarousel);
    }

    // --- Lógica para el Chatbot (Activación Manual) ---
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendButton = document.getElementById('chatbot-send-button');
    const chatbotMessages = document.getElementById('chatbot-messages');

    let faqData = {}; // Variable para almacenar los datos del FAQ

    // Función para cargar los datos del FAQ
    async function loadFAQ() {
        try {
            const response = await fetch('data/faq.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            faqData = await response.json();
            console.log('FAQ Data cargado:', faqData);
        } catch (error) {
            console.error('Error al cargar el FAQ:', error);
            addChatMessage('bot', 'Lo siento, no pude cargar la base de conocimientos en este momento.');
        }
    }

    // Cargar el FAQ al inicio, pero NO mostrar el chatbot
    loadFAQ();

    // Función para añadir mensajes al chat
    function addChatMessage(sender, message) {
        const messageElement = document.createElement('div');
        // Usar clases de Tailwind para alinear y estilizar
        messageElement.classList.add('flex', 'mb-2', sender === 'user' ? 'justify-end' : 'justify-start');
        messageElement.innerHTML = `
            <span class="inline-block p-2 rounded-lg max-w-[80%] ${sender === 'user' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'}">
                ${message}
            </span>
        `;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
    }

    // Función para procesar la pregunta del usuario
    function processUserMessage(message) {
        addChatMessage('user', message);
        const lowerCaseMessage = message.toLowerCase();
        let foundAnswer = false;

        // Recorrer todas las categorías en faqData
        for (const category in faqData) {
            if (faqData.hasOwnProperty(category)) {
                const questions = faqData[category];
                for (const qa of questions) {
                    // Buscar coincidencia en la pregunta o en las palabras clave
                    const questionMatch = qa.question.toLowerCase().includes(lowerCaseMessage);
                    const keywordMatch = qa.keywords.some(keyword => lowerCaseMessage.includes(keyword.toLowerCase()));

                    if (questionMatch || keywordMatch) {
                        addChatMessage('bot', qa.answer);
                        foundAnswer = true;
                        break; // Detener después de encontrar la primera respuesta
                    }
                }
            }
            if (foundAnswer) break; // Si ya encontramos una respuesta, salimos de las categorías
        }

        if (!foundAnswer) {
            addChatMessage('bot', 'Lo siento, no encontré una respuesta a tu pregunta. Por favor, intenta reformularla o consulta las secciones de la página.');
        }
    }

    // Manejadores de eventos para el chatbot
    if (chatbotToggleButton && chatbotContainer && chatbotCloseButton && chatbotInput && chatbotSendButton && chatbotMessages) {
        chatbotToggleButton.addEventListener('click', function() {
            chatbotContainer.classList.toggle('hidden');
            chatbotContainer.classList.toggle('block');
            if (chatbotContainer.classList.contains('block')) {
                // Si se abre el chatbot, se puede enviar un mensaje de bienvenida
                if (chatbotMessages.children.length === 0) { // Solo si no hay mensajes previos
                    addChatMessage('bot', '¡Hola! Soy el asistente virtual de Ximena Lopez Yule. ¿En qué puedo ayudarte?');
                }
                chatbotInput.focus(); // Enfocar el input cuando se abre
            }
        });

        chatbotCloseButton.addEventListener('click', function() {
            chatbotContainer.classList.add('hidden');
            chatbotContainer.classList.remove('block');
        });

        chatbotSendButton.addEventListener('click', function() {
            const message = chatbotInput.value.trim();
            if (message) {
                processUserMessage(message);
                chatbotInput.value = '';
            }
        });

        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                chatbotSendButton.click();
            }
        });
    }
});