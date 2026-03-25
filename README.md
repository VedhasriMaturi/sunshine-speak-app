🌤️ Sunshine Speak App

🎙️ Turning weather updates into human-like voice experiences using Murf AI

🚀 Project Overview

Sunshine Speak App is a responsive and interactive weather application that delivers real-time weather updates along with AI-powered voice narration.

Unlike traditional weather apps, this project enhances user experience by converting weather data into natural-sounding speech using Murf AI, making it more engaging, accessible, and user-friendly.

✨ Key Features
🌍 Search weather by city name
🌡️ Real-time temperature, humidity, and conditions
🎙️ AI-generated voice output using Murf AI
📱 Fully responsive (mobile + desktop compatible)
⚡ Clean and intuitive UI
🔐 Secure API key management with environment variables
🛠️ Tech Stack
Technology	Usage
HTML / CSS / JavaScript (or React)	Frontend UI
Weather API	Fetch real-time weather data
Murf AI API	Text-to-Speech conversion
dotenv	Environment variable management
📂 Folder Structure
sunshine-speak-app/
│
├── public/              # Static assets
├── src/
│   ├── components/      # UI components
│   ├── services/        # API calls (Weather + Murf)
│   ├── App.js           # Main app logic
│   └── index.js         # Entry point
│
├── .env                 # Environment variables (not pushed)
├── .gitignore           # Ignored files
├── package.json         # Project metadata & dependencies
└── README.md            # Project documentation
⚙️ Installation & Setup

Follow these steps to run the project locally:

1️⃣ Clone the Repository
git clone https://github.com/VedhasriMaturi/sunshine-speak-app.git
cd sunshine-speak-app
2️⃣ Install Dependencies
npm install
3️⃣ Configure Environment Variables

Create a .env file in the root directory and add:

WEATHER_API_KEY=your_weather_api_key
MURF_API_KEY=your_murf_api_key

⚠️ Important: Never expose your API keys publicly.

4️⃣ Start the Application
npm start

Open your browser and visit:

http://localhost:3000
🔌 API Integration
🌦️ Weather API

Used to fetch real-time weather details such as:

Temperature
Humidity
Weather conditions
🎙️ Murf AI API
Converts weather data into human-like speech
Provides a more engaging and accessible experience
🔐 Security Practices
API keys are stored securely in .env files
.env is included in .gitignore
No sensitive data is exposed in the repository
🧠 Application Workflow
User enters a city name
App fetches weather data from the Weather API
Weather information is displayed on the UI
Data is passed to Murf AI
Murf AI generates voice narration
Audio is played to the user 🎧
