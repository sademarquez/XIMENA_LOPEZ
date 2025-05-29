// chatbot.js - Lógica para el chatbot interactivo

document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatbotBtn = document.getElementById('closeChatbot');
    const chatbotBody = document.getElementById('chatbotBody');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendChatbotBtn = document.getElementById('sendChatbot');

    let faqData = {}; // Objeto para almacenar las preguntas frecuentes del JSON

    // --- Cargar datos del JSON para el Chatbot ---
    fetch('data/faq.json')
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
            // Mensaje para el usuario si no se pueden cargar las preguntas frecuentes
            appendMessage('bot', 'Lo siento, no pude cargar la información de preguntas frecuentes en este momento. Por favor, intenta de nuevo más tarde o contáctame directamente.', 'error-message');
        });

    // --- Funcionalidad para abrir y cerrar el chatbot ---
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('is-active');
        // Asegúrate de que el body del chatbot haga scroll al final si se abre
        if (chatbotContainer.classList.contains('is-active')) {
            setTimeout(() => chatbotBody.scrollTop = chatbotBody.scrollHeight, 100);
        }
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('is-active');
    });

    // --- Función para añadir mensajes al cuerpo del chat ---
    function appendMessage(sender, text, className = '') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        if (className) {
            messageElement.classList.add(className);
        }
        messageElement.textContent = text;
        chatbotBody.appendChild(messageElement);
        // Desplazar al final de la conversación
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    // --- Lógica de respuesta del chatbot ---
    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();

        // Primero, buscar coincidencias exactas o cercanas en las preguntas frecuentes
        for (const category in faqData) {
            for (const item of faqData[category]) {
                const keywords = item.keywords.map(kw => kw.toLowerCase());
                // Simple comprobación de palabras clave
                if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
                    return item.answer;
                }
            }
        }

        // Respuestas generales si no hay coincidencias directas
        if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('saludo')) {
            return '¡Hola! ¿En qué puedo ayudarte hoy? Puedes preguntar sobre "víctimas", "PDET", "apoyo jurídico" o "emisora".';
        } else if (lowerCaseMessage.includes('gracias') || lowerCaseMessage.includes('agradezco')) {
            return 'De nada. Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en consultarme.';
        } else if (lowerCaseMessage.includes('víctimas') || lowerCaseMessage.includes('derechos')) {
            return 'Sobre el tema de víctimas, ¿te gustaría saber sobre el Registro Único de Víctimas (RUV), la ruta de atención humanitaria, o la participación?';
        } else if (lowerCaseMessage.includes('pdet') || lowerCaseMessage.includes('territorio')) {
            return 'Los PDET son programas de desarrollo territorial. ¿Quieres saber qué son, sus avances, o cómo participar?';
        } else if (lowerCaseMessage.includes('apoyo jurídico') || lowerCaseMessage.includes('legal')) {
            return 'Para apoyo jurídico, por favor visita nuestra sección "Apoyo Jurídico" y llena el formulario, o si tienes una pregunta general, puedo intentar responderla.';
        } else if (lowerCaseMessage.includes('emisora') || lowerCaseMessage.includes('radio')) {
            return 'Nuestra emisora comunitaria "Voz de Esperanza" difunde información y testimonios. Puedes escucharla en la sección "Emisora".';
        } else if (lowerCaseMessage.includes('contacto')) {
            return 'Puedes encontrar mi información de contacto (email, teléfono, redes sociales) en la sección "Contacto" de la página web.';
        } else {
            return 'Lo siento, no entiendo tu pregunta. ¿Podrías reformularla o ser más específico? Recuerda que soy un asistente virtual y mis conocimientos son limitados. Para consultas más complejas, por favor usa el formulario de contacto.';
        }
    }

    // --- Manejo del envío de mensajes por el usuario ---
    sendChatbotBtn.addEventListener('click', () => {
        sendMessage();
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return; // No enviar mensajes vacíos

        appendMessage('user', userMessage); // Mostrar mensaje del usuario
        chatbotInput.value = ''; // Limpiar el input

        // Simular un retraso en la respuesta del bot
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            appendMessage('bot', botResponse);
        }, 800); // Retraso de 0.8 segundos
    }

    // Mensaje de bienvenida inicial del bot
    appendMessage('bot', '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy sobre víctimas o PDET?');
});