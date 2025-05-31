// Lógica JavaScript para la Campaña de Ximena Lopez Yule

document.addEventListener('DOMContentLoaded', function () {
    // Lógica para el menú móvil (menú de hamburguesa)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile'); // Selecciona ambos tipos de enlaces

    mobileMenuButton.addEventListener('click', function() {
        // Alterna la visibilidad del menú móvil
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('block');
    });

    // Lógica para el desplazamiento suave de los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previene el comportamiento predeterminado del ancla
            
            const targetId = this.getAttribute('href'); // Obtiene el ID de la sección objetivo
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Desplazamiento suave a la sección
                window.scrollTo({
                    top: targetSection.offsetTop - document.querySelector('header').offsetHeight, // Ajusta por la altura del encabezado fijo
                    behavior: 'smooth'
                });

                // Cierra el menú móvil después de hacer clic en un enlace
                if (mobileMenu.classList.contains('block')) {
                    mobileMenu.classList.remove('block');
                    mobileMenu.classList.add('hidden');
                }

                // Actualiza la clase 'active' para los enlaces de navegación
                navLinks.forEach(navLink => {
                    if (navLink.getAttribute('href') === targetId) {
                        navLink.classList.add('active');
                    } else {
                        navLink.classList.remove('active');
                    }
                });
            }
        });
    });


    // Lógica del Chatbot
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatButton = document.getElementById('close-chat-button');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Mostrar/Ocultar el modal del chatbot
    chatbotButton.addEventListener('click', function() {
        chatbotModal.classList.toggle('hidden');
    });

    closeChatButton.addEventListener('click', function() {
        chatbotModal.classList.add('hidden'); // Siempre oculta el modal al hacer clic en la X
    });

    // Función para añadir mensajes al chat
    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble');
        if (sender === 'user') {
            messageElement.classList.add('user-message');
        } else {
            messageElement.classList.add('bot-message');
        }
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Desplazar al final para ver el último mensaje
    }

    // Función para simular la respuesta del bot utilizando la API de Gemini
    async function getBotResponse(userMessage) {
        // Muestra un mensaje de "escribiendo..." mientras el bot procesa la respuesta
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('bot-message', 'message-bubble');
        typingIndicator.textContent = 'Escribiendo...';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Configuración para la llamada a la API de Gemini
        // IMPORTANTE: Para una implementación real y segura en producción,
        // las llamadas a la API de un LLM (como Gemini) DEBEN realizarse
        // a través de un backend (ej. funciones sin servidor, un servidor Node.js/Python)
        // para proteger tu API Key. NUNCA expongas tu API Key directamente en el código del cliente.
        const prompt = userMessage;
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        // La API Key se deja vacía; el entorno de Canvas la proporcionará en tiempo de ejecución.
        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            
            // Eliminar el indicador de "escribiendo..." una vez que se recibe la respuesta
            chatMessages.removeChild(typingIndicator);

            // Verifica si la respuesta de la API contiene el texto esperado
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const botText = result.candidates[0].content.parts[0].text;
                addMessage('bot', botText); // Añade la respuesta del bot al chat
            } else {
                // Manejo de casos donde la estructura de la respuesta es inesperada o el contenido falta
                addMessage('bot', 'Lo siento, no pude generar una respuesta. Intenta de nuevo.');
            }
        } catch (error) {
            // Manejo de errores en la llamada a la API
            chatMessages.removeChild(typingIndicator); // Eliminar el indicador en caso de error
            console.error('Error al llamar a la API de Gemini:', error);
            addMessage('bot', 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo más tarde.');
        }
    }

    // Event listener para el botón de enviar mensaje
    sendButton.addEventListener('click', function() {
        const userMessage = chatInput.value.trim(); // Obtiene el texto del input y elimina espacios en blanco
        if (userMessage) { // Si el mensaje no está vacío
            addMessage('user', userMessage); // Añade el mensaje del usuario al chat
            chatInput.value = ''; // Limpia el campo de entrada
            getBotResponse(userMessage); // Obtiene la respuesta del bot
        }
    });

    // Event listener para enviar mensaje con la tecla Enter
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click(); // Simula un clic en el botón de enviar
        }
    });
});
