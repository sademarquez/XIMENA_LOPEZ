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

                // Si el menú móvil está abierto, ciérralo después de hacer clic
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('block');
                    mobileMenuButton.setAttribute('aria-expanded', false);
                }
            }
        });
    });

    // --- Lógica para el carrusel infinito de logos ---
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        // Duplicar los elementos del carrusel para un scroll infinito suave
        const carouselItems = Array.from(carouselTrack.children);
        carouselItems.forEach(item => {
            const clone = item.cloneNode(true);
            carouselTrack.appendChild(clone);
        });

        // Asegurar que la animación CSS 'scrollLeft' tenga una duración adecuada
        // y que el 'to { transform: translateX(-50%); }' funcione correctamente.
        // El -50% asegura que la copia de los elementos originales esté visible
        // justo cuando los originales desaparecen, creando el bucle.
    }

    // --- Lógica para el Chatbot ---
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendButton = document.getElementById('chatbot-send-button');
    const chatbotMessages = document.getElementById('chatbot-messages');

    let faqData = {}; // Para almacenar las preguntas y respuestas del FAQ

    // Función para cargar el FAQ desde el JSON
    async function loadFAQ() {
        try {
            const response = await fetch('faq.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            faqData = await response.json();
            console.log('FAQ cargado:', faqData);
        } catch (error) {
            console.error('Error al cargar el FAQ:', error);
            addChatMessage('bot', 'Lo siento, no pude cargar la información de preguntas frecuentes en este momento.');
        }
    }

    // Función para añadir un mensaje al chatbot
    function addChatMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('mb-2', 'p-2', 'rounded-lg', 'max-w-[80%]');
        if (sender === 'user') {
            messageElement.classList.add('bg-purple-gradient-end', 'text-white', 'ml-auto');
        } else {
            messageElement.classList.add('bg-gray-200', 'text-gray-800', 'mr-auto');
        }
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll al final
    }

    // Función para procesar el mensaje del usuario y responder
    function processUserMessage(message) {
        addChatMessage('user', message);

        const lowerCaseMessage = message.toLowerCase();
        let botResponse = "Disculpa, no entiendo tu pregunta. Por favor, intenta de nuevo o formula tu pregunta de otra manera. También puedes consultar nuestras secciones 'Propuestas' o 'Eventos'.";

        // Iterar sobre todas las categorías en faqData
        for (const category in faqData) {
            if (faqData.hasOwnProperty(category)) {
                const questions = faqData[category];
                for (const qna of questions) {
                    const keywords = qna.keywords.map(kw => kw.toLowerCase());
                    const questionMatch = lowerCaseMessage.includes(qna.question.toLowerCase());
                    const keywordMatch = keywords.some(keyword => lowerCaseMessage.includes(keyword));

                    if (questionMatch || keywordMatch) {
                        botResponse = qna.answer;
                        break; // Salir del bucle interno si se encuentra una respuesta
                    }
                }
            }
            if (botResponse !== "Disculpa, no entiendo tu pregunta. Por favor, intenta de nuevo o formula tu pregunta de otra manera. También puedes consultar nuestras secciones 'Propuestas' o 'Eventos'.") {
                break; // Salir del bucle externo si se encontró una respuesta
            }
        }

        setTimeout(() => {
            addChatMessage('bot', botResponse);
        }, 500); // Pequeño delay para simular que el bot "piensa"
    }

    // Manejadores de eventos para el chatbot
    if (chatbotToggleButton && chatbotContainer && chatbotCloseButton && chatbotInput && chatbotSendButton && chatbotMessages) {
        chatbotToggleButton.addEventListener('click', function() {
            chatbotContainer.classList.toggle('hidden');
            chatbotContainer.classList.toggle('block');
            if (chatbotContainer.classList.contains('block')) {
                if (chatbotMessages.children.length === 0) { // Solo si no hay mensajes previos
                    addChatMessage('bot', '¡Hola! Soy el asistente virtual de Ximena Lopez Yule. ¿En qué puedo ayudarte?');
                }
                chatbotInput.focus();
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

        // Cargar el FAQ al inicio
        loadFAQ();
    }
});