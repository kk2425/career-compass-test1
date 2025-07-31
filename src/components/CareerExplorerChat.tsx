import React, { useState, useEffect, useRef } from 'react';
import { AptitudeScores, InterestScores, AIRoadmap, ChatMessage } from '../types';
import { createCareerChat } from '../services/geminiService';
import { Chat } from '@google/genai';
import Button from './ui/Button';
import Card from './ui/Card';

interface CareerExplorerChatProps {
    aptitudeScores: AptitudeScores;
    interestScores: InterestScores;
    userAnswers: string[];
    aiRoadmap: AIRoadmap[];
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const LoadingDots: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
);

const CareerExplorerChat: React.FC<CareerExplorerChatProps> = ({ aptitudeScores, interestScores, userAnswers, aiRoadmap }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatInstance = createCareerChat(aptitudeScores, interestScores, userAnswers, aiRoadmap);
        setChat(chatInstance);

        const welcomeMessage: ChatMessage = {
            role: 'model',
            text: "Hello! I'm Compass AI. I've analyzed your profile and I'm here to help you explore your future. You can ask me to elaborate on your recommended careers, or we can discuss any other career you're curious about. What's on your mind?"
        };
        setMessages([welcomeMessage]);
    }, [aptitudeScores, interestScores, userAnswers, aiRoadmap]);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [messages]);

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || userInput;
        if (!textToSend.trim() || !chat || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: textToSend });
            const modelMessage: ChatMessage = { role: 'model', text: response.text ?? "" };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "I'm sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedPrompts = [
        `Tell me more about being a ${aiRoadmap[0]?.jobTitle || 'Software Engineer'}.`,
        "Would I be a good fit for being a veterinarian?",
        "What's a good project for someone with my skills?"
    ];

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <div ref={chatContainerRef} className="h-96 overflow-y-auto pr-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0"></div>}
                        <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user'
                                ? 'bg-slate-700 text-white rounded-br-none'
                                : 'bg-slate-600 text-slate-200 rounded-bl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0"></div>
                        <div className="max-w-md p-3 rounded-2xl bg-slate-600 text-slate-200 rounded-bl-none">
                            <LoadingDots />
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex gap-2 mb-3 flex-wrap">
                    {suggestedPrompts.map((prompt, i) => (
                        <button key={i} onClick={() => handleSendMessage(prompt)} disabled={isLoading} className="text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-50 transition-colors text-slate-300 py-1 px-3 rounded-full">
                            {prompt}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a follow-up question..."
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <Button onClick={() => handleSendMessage()} disabled={!userInput.trim() || isLoading} className="h-12 w-12 p-0 flex-shrink-0" aria-label="Send message">
                        <SendIcon className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default CareerExplorerChat;
