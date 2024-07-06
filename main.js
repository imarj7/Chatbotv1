// main.js
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const inputInitHeight = chatInput.scrollHeight;

const RAPIDAPI_URL = 'https://infinite-gpt.p.rapidapi.com/infinite-gpt';
const RAPIDAPI_KEY = '372f7e9d90msh72032bb88ddce8dp1ce713jsn0509e409f2d8';

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}

const generateRapidApiResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    const bodyContent = {
        query: userMessage,
        sysMsg: 'You are a friendly Chatbot.'
    };

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'infinite-gpt.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyContent)
    };

    try {
        const response = await fetch(RAPIDAPI_URL, options);
        const result = await response.json();
        
        if (!result.serverError && !result.clientError) {
            messageElement.textContent = result.msg;
        } else {
            throw new Error("API Error: Unexpected response.");
        }
        
    } catch (error) {
        console.error(error);
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if(!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        generateRapidApiResponse(incomingChatLi);
        
    }, 800);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
