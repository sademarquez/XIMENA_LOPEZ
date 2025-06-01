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
                if (mobileMenu && mobileMenu.classList.contains('block')) {
                    mobileMenu.classList.remove('block');
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // --- Lógica del Chatbot ---
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatButton = document.getElementById('close-chat-button');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    let faqData = {}; // Objeto para almacenar las preguntas frecuentes del JSON
    let welcomeMessageShown = false; // Bandera para controlar el mensaje de bienvenida

    // Cargar datos del JSON para el Chatbot
    // Asegúrate de que la ruta a faq.json sea correcta, por ejemplo: 'data/faq.json' si está en una carpeta 'data'
    fetch('faq.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            faqData = data;
            console.log('FAQ data loaded:', faqData);
        })
        .catch(error => {
            console.error('Error loading FAQ data:', error);
            // Mensaje de error si no se cargan las FAQs
            // Se añade solo si el chat no está abierto al inicio, o cuando se intente usar.
        });

    // Función para añadir mensajes al chat
    function addMessage(sender, text) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        if (sender === 'user') {
            messageBubble.classList.add('user-message');
        } else {
            messageBubble.classList.add('bot-message');
        }
        messageBubble.textContent = text;
        chatMessages.appendChild(messageBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Desplazar al final
    }

    // Función para simular el typing indicator del bot
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('bot-message', 'typing-indicator');
        typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>'; // Simple animación de puntos
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingIndicator;
    }

    // Función principal para obtener la respuesta del bot
    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        let botResponse = 'Lo siento, no entiendo tu pregunta. ¿Podrías reformularla o ser más específico? Puedes preguntar sobre "derechos de víctimas", "PDET", "eventos" o "contacto".';

        // Buscar en FAQ por categorías
        for (const category in faqData) {
            for (const item of faqData[category]) {
                const lowerCaseQuestion = item.question.toLowerCase();
                const keywords = item.keywords.map(kw => kw.toLowerCase());

                // Coincidencia directa de la pregunta o palabras clave
                if (lowerCaseMessage.includes(lowerCaseQuestion) || keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
                    botResponse = item.answer;
                    return botResponse; // Devuelve la primera coincidencia relevante
                }
            }
        }

        // Respuestas generales si no hay coincidencia en FAQ
        if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('saludo')) {
            botResponse = '¡Hola! ¿En qué puedo ayudarte hoy?';
        } else if (lowerCaseMessage.includes('gracias')) {
            botResponse = 'De nada. Estoy aquí para servirte.';
        } else if (lowerCaseMessage.includes('emisora') || lowerCaseMessage.includes('radio')) {
            botResponse = 'Puedes escuchar nuestra emisora "Voz de Esperanza" en la sección "Multimedia" de la página web. Allí encontrarás el reproductor.';
        } else if (lowerCaseMessage.includes('contacto') || lowerCaseMessage.includes('llamar') || lowerCaseMessage.includes('escribir')) {
            botResponse = 'Puedes encontrar la información de contacto (email, teléfono, redes sociales) en la sección "Contacto" de la página web.';
        } else if (lowerCaseMessage.includes('eventos') || lowerCaseMessage.includes('agenda')) {
             botResponse = 'Puedes ver los próximos eventos de la campaña en la sección "Eventos". ¡Te esperamos!';
        } else if (lowerCaseMessage.includes('propuestas') || lowerCaseMessage.includes('plan de gobierno')) {
            botResponse = 'Mis propuestas están detalladas en la sección "Propuestas". Abordan temas como apoyo a víctimas, PDET, educación y desarrollo rural.';
        } else if (lowerCaseMessage.includes('quien eres') || lowerCaseMessage.includes('ximena')) {
            botResponse = 'Soy Ximena Lopez Yule, tu candidata comprometida con el desarrollo y la paz del suroccidente colombiano. Puedes conocer más sobre mí en la sección "Quién Soy".';
        }

        return botResponse;
    }

    // --- Lógica de Apertura y Cierre del Chatbot ---
    if (chatbotButton && chatbotModal && closeChatButton) {
        // Al hacer clic en el botón flotante (logo del chatbot)
        chatbotButton.addEventListener('click', function() {
            // Alterna la visibilidad del modal
            chatbotModal.classList.toggle('hidden');

            // Si el chatbot se acaba de hacer visible Y el mensaje de bienvenida no se ha mostrado
            if (!chatbotModal.classList.contains('hidden') && !welcomeMessageShown) {
                addMessage('bot', '¡Hola! Soy tu asistente virtual de la campaña de Ximena Lopez Yule. Estoy aquí para resolver tus dudas sobre el apoyo a víctimas, los acuerdos PDET, eventos de campaña y más. ¿En qué puedo ayudarte?');
                welcomeMessageShown = true; // Establecer la bandera a true
            }
        });

        // Al hacer clic en la "X" del encabezado del chatbot
        closeChatButton.addEventListener('click', function() {
            chatbotModal.classList.add('hidden'); // Ocultar el modal
        });
    }

    // Event listener para el botón de enviar mensaje
    if (sendButton && chatInput && chatMessages) {
        sendButton.addEventListener('click', function() {
            const userMessage = chatInput.value.trim();
            if (userMessage) {
                addMessage('user', userMessage);
                chatInput.value = '';

                const typingIndicator = showTypingIndicator(); // Mostrar el indicador

                setTimeout(() => {
                    if (chatMessages.contains(typingIndicator)) { // Asegurarse de que el indicador aún esté presente
                        chatMessages.removeChild(typingIndicator); // Eliminar el indicador
                    }
                    const botResponse = getBotResponse(userMessage);
                    addMessage('bot', botResponse);
                }, 1200); // Simular un tiempo de respuesta más realista
            }
        });

        // Event listener para enviar mensaje con la tecla Enter
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }

    // --- Funcionalidad del Reproductor de Emisora ---
    const radioAudio = document.getElementById('radio-audio');
    const playRadioBtn = document.getElementById('play-radio-button');

    if (radioAudio && playRadioBtn) {
        playRadioBtn.addEventListener('click', function() {
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

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const topic = document.getElementById('topic').value;

            alert(`Gracias, ${name}! Tu solicitud de apoyo jurídico sobre "${topic}" ha sido enviada. Te contactaremos pronto al correo ${email}.`);

            this.reset(); // Limpia el formulario
        });
    }
});