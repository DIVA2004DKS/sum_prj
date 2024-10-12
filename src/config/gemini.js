
/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai"

  const apikey= "AIzaSyAL8ofxJ1l5cXexAI5ikb9FQQcei-EiKGo"
  //const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apikey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  

  async function run(prompt) {
    try {
        console.log('Starting chat session...');
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        console.log('Sending message...');
        const result = await chatSession.sendMessage(prompt);
        console.log('Received response:', result);

        const responseText = await result.response.text(); // Ensure you await the text conversion
        console.log('Response text:', responseText);

        return responseText;
    } catch (error) {
        console.error('Error in run function:', error);
        throw error;
    }
}


  export default run;