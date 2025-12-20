"use client";

import React, { useState, useEffect } from "react";
import { FaMicrophone, FaStop, FaMagic } from "react-icons/fa";
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;


const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [userText, setUserText] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("Tayyor");
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false; 
      recog.lang = "en-US"; 
      
      recog.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setUserText(text);
        setStatus("Ovoz qabul qilindi! Endi 'Rasm Yaratish' ni bosing.");
        setIsRecording(false);
      };

      recog.onerror = (e) => setStatus("Xatolik: " + e.error);
      recog.onend = () => setIsRecording(false);

      setRecognition(recog);
    } else {
      alert("Brauzeringiz ovoz yozishni qo'llab-quvvatlamaydi. Chrome ishlating.");
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
      setStatus("Eshitilyapti... Gapiring!");
      setUserText("");
      setRefinedPrompt("");
      setImageUrl("");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const generateImage = async () => {
    if (!userText) return alert("Avval biror narsa deb gapiring!");
    
    setLoading(true);
    setStatus("Groq AI prompt yozmoqda...");

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert AI Image Prompt generator. Create a highly detailed, descriptive prompt for an image generator based on the user's input. Keep it under 40 words. Direct description only, no introduction."
          },
          {
            role: "user",
            content: userText
          }
        ],
        model: "llama-3.3-70b-versatile",
      });

      const enhancedText = completion.choices[0]?.message?.content || userText;
      
      setRefinedPrompt(enhancedText);
      setStatus("Rasm chizilmoqda...");

      const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedText)}?width=1024&height=1024&nologo=true&seed=${Math.random()}`;
      
      setImageUrl(finalUrl);
      setStatus("Tayyor!");

    } catch (error) {
      console.error(error);
      setStatus("Xatolik: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white font-sans">
      <h1 className="text-4xl font-bold mb-6 text-orange-500 tracking-wide">AI Voice Painter (Groq Llama 3.3)</h1>

      <div className="mb-6 px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-600">
        Status: <span className="text-white font-semibold">{status}</span>
      </div>

      <div className="flex gap-4 mb-8">
        {!isRecording ? (
          <button onClick={startRecording} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition font-bold shadow-lg">
            <FaMicrophone /> Ovoz Yozish
          </button>
        ) : (
          <button onClick={stopRecording} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full transition font-bold shadow-lg animate-pulse">
            <FaStop /> To'xtatish
          </button>
        )}

        <button 
          onClick={generateImage} 
          disabled={!userText || loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition font-bold shadow-lg ${!userText || loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          <FaMagic /> Rasm Yaratish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-fit">
          <div className="mb-4">
            <h3 className="text-gray-400 text-sm uppercase mb-1">Siz aytdingiz:</h3>
            <p className="text-lg text-white font-medium min-h-[30px]">{userText || "..."}</p>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-gray-400 text-sm uppercase mb-1 flex items-center gap-2">
               Groq (Llama 3.3) Prompti:
            </h3>
            <p className="text-sm text-orange-300 font-mono italic min-h-[30px]">
              {refinedPrompt || "..."}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-2 rounded-2xl shadow-xl border border-gray-700 flex items-center justify-center min-h-[300px] aspect-square">
          {loading ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Groq o'ylamoqda...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Generated AI" className="w-full h-full object-cover rounded-xl shadow-inner" />
          ) : (
            <div className="text-gray-500 text-center">
              <FaMagic className="text-4xl mx-auto mb-2 opacity-30" />
              <p>Rasm shu yerda paydo bo'ladi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}