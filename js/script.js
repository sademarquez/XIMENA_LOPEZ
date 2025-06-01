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

                // Cerrar el menú móvil si está abierto
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('block');
                    mobileMenuButton.setAttribute('aria-expanded', false);
                }
            }
        });
    });

    // --- Lógica para cambiar el estilo del header al hacer scroll ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Cambia el valor a tu preferencia
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // --- Lógica del carrusel infinito (Sección Multimedia) ---
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        // Clonar elementos para crear un bucle infinito
        const carouselItems = Array.from(carouselTrack.children);
        carouselItems.forEach(item => {
            const clone = item.cloneNode(true);
            carouselTrack.appendChild(clone);
        });

        // Configurar la animación del carrusel con JavaScript
        // Esta parte es más compleja para un carrusel 100% JS.
        // Para simplificar, la animación se maneja principalmente con CSS (keyframes)
        // y se ajusta el translateX en CSS para que haga el ciclo.
        // Asegúrate de que tu CSS para .carousel-track y @keyframes scrollLeft esté bien definido.
        // La animación se controla con CSS, y la duplicación de items asegura que no haya un "salto" visible.
    }

    // --- Lógica para el Chatbot ---
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendButton = document.getElementById('chatbot-send-button');
    const chatbotMessages = document.getElementById('chatbot-messages');

    let faqData = {}; // Variable para almacenar los datos del FAQ

    // Función para cargar el FAQ
    async function loadFAQ() {
        try {
            // CAMBIO AQUÍ: Ruta corregida para faq.json
            const response = await fetch('data/faq.json'); 
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            faqData = await response.json();
            console.log('FAQ cargado exitosamente:', faqData);
        } catch (error) {
            console.error('Error al cargar el FAQ:', error);
            addChatMessage('bot', 'Lo siento, no pude cargar la información de preguntas frecuentes en este momento. Por favor, inténtalo más tarde.');
        }
    }

    // Añadir mensaje al chat
    function addChatMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message', 'mb-2', 'p-2', 'rounded-lg', 'max-w-[80%]');
        messageElement.classList.add(sender === 'user' ? 'bg-blue-500' : 'bg-gray-300', sender === 'user' ? 'text-white' : 'text-gray-800', sender === 'user' ? 'ml-auto' : 'mr-auto');
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll
    }

    // Procesar mensaje del usuario
    function processUserMessage(message) {
        addChatMessage('user', message);
        const lowerCaseMessage = message.toLowerCase();

        // Buscar en las categorías del FAQ
        let foundAnswer = false;
        for (const category in faqData) {
            if (faqData.hasOwnProperty(category)) {
                const items = faqData[category];
                for (const item of items) {
                    if (item.keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
                        addChatMessage('bot', item.answer);
                        foundAnswer = true;
                        break; // Salir del bucle interno si se encuentra una respuesta
                    }
                }
            }
            if (foundAnswer) break; // Salir del bucle externo si se encuentra una respuesta
        }

        if (!foundAnswer) {
            addChatMessage('bot', 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla o preguntar sobre otro tema?');
        }
    }

    // Cargar el FAQ al iniciar
    loadFAQ();

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