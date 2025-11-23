Certainly! Below is the JavaScript code extracted from your HTML file. You can save this code in a separate JavaScript file, for example, `script.js`.

```javascript
// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Chatbot Implementation with Gemini AI
const chatbotIcon = document.getElementById("chatbotIcon");
const chatbotWindow = document.getElementById("chatbotWindow");
const closeChatbot = document.getElementById("closeChatbot");
const chatbotInput = document.getElementById("chatbotInput");
const sendChatbotMessage = document.getElementById("sendChatbotMessage");
const chatbotMessages = document.getElementById("chatbotMessages");

// Google Gemini API configuration
<script>
  const apiKey = '9a40c10c1e2293c30ce3f13ed369fea2'; // Replace with your OpenWeatherMap API key

  function extractCityCountry(text) {
    const locationPart = text.split('•')[0].trim(); // "Bali, Indonesia"
    return locationPart;
  }

  async function getWeather(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      const temp = Math.round(data.main.temp);
      const description = data.weather[0].description;

      document.getElementById('weatherTemp').textContent = `${temp}°F`;
      document.getElementById('weatherDesc').textContent = description.charAt(0).toUpperCase() + description.slice(1);
    } catch (error) {
      document.getElementById('weatherTemp').textContent = 'N/A';
      document.getElementById('weatherDesc').textContent = 'Error fetching weather';
      console.error('Weather API error:', error);
    }
  }

  // On page load
  document.addEventListener('DOMContentLoaded', () => {
    const tripInfoText = document.getElementById('tripInfo').textContent;
    const destination = extractCityCountry(tripInfoText);
    getWeather(destination);
  });
</script>

const GOOGLE_API_KEY = 'AIzaSyDudnt6l_RVPTuwnnj0VqrtLq8WVDewrMY';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

// Chatbot state
let conversationHistory = [
  {
    role: "model",
    parts: [{ text: "Hello! I'm your PackWise AI assistant. I can help you create personalized packing lists based on your destination, travel dates, and trip type. Where are you traveling to?" }]
  }
];

// Toggle chatbot window
chatbotIcon.addEventListener('click', () => {
  chatbotWindow.classList.toggle('active');
});

closeChatbot.addEventListener('click', () => {
  chatbotWindow.classList.remove('active');
});

// Send message function
async function sendMessage() {
  const message = chatbotInput.value.trim();
  if (!message) return;

  // Add user message to UI
  addMessage(message, 'user');
  chatbotInput.value = '';

  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message bot-message';
  typingIndicator.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
  chatbotMessages.appendChild(typingIndicator);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  try {
    // Add user message to conversation history
    conversationHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Call Gemini API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
          stopSequences: []
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const botResponse = data.candidates[0].content.parts[0].text;
      
      // Remove typing indicator
      chatbotMessages.removeChild(typingIndicator);
      
      // Add bot response to UI and history
      addMessage(botResponse, 'bot');
      conversationHistory.push({
        role: "model",
        parts: [{ text: botResponse }]
      });
    } else {
      throw new Error("Invalid response from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    chatbotMessages.removeChild(typingIndicator);
    addMessage("Sorry, I'm having trouble connecting to the AI service. Please try again