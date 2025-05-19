import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Message {
  text: string;
  isBot: boolean;
  action?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

const staticMentors = [
  {
    name: "Dr. Sarah Chen",
    expertise: ["Machine Learning", "AI Ethics"],
    experience_years: 12
  },
  {
    name: "Michael Rodriguez",
    expertise: ["Software Architecture", "Cloud Computing"],
    experience_years: 15
  },
  {
    name: "Priya Patel",
    expertise: ["Product Management", "UX Design"],
    experience_years: 8
  }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your Alumni Connect assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('id, title, company, location')
        .limit(5);
      if (data) setJobs(data);
    };

    fetchJobs();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isBot: false }]);

    // Process the input and generate response
    const response = generateResponse(input.toLowerCase());
    setMessages(prev => [...prev, response]);
    setInput('');

    // If there's an action, execute it after a short delay
    if (response.action) {
      setTimeout(() => {
        navigate(response.action!);
        setIsOpen(false);
      }, 1000);
    }
  };

  const generateResponse = (input: string): Message => {
    if (input.includes('job') || input.includes('jobs') || input.includes('work')) {
      if (input.includes('list') || input.includes('show') || input.includes('available')) {
        return {
          text: `Here are some recent job openings:\n\n${jobs.map(job => 
            `• ${job.title} at ${job.company} (${job.location})`
          ).join('\n')}`,
          isBot: true
        };
      }
      return {
        text: "Let me show you our job board where you can find career opportunities.",
        isBot: true,
        action: '/jobs'
      };
    }

    if (input.includes('mentor') || input.includes('mentors')) {
      if (input.includes('list') || input.includes('show') || input.includes('available')) {
        return {
          text: `Here are some available mentors:\n\n${staticMentors.map(mentor =>
            `• ${mentor.name} - ${mentor.expertise.join(', ')} (${mentor.experience_years} years experience)`
          ).join('\n')}`,
          isBot: true
        };
      }
      return {
        text: "I'll direct you to our mentorship program page.",
        isBot: true,
        action: '/mentorship'
      };
    }

    if (input.includes('event') || input.includes('meeting')) {
      return {
        text: "I'll take you to our events page where you can find all upcoming events and register for them.",
        isBot: true,
        action: '/events'
      };
    }

    if (input.includes('alumni') || input.includes('graduate') || input.includes('find')) {
      return {
        text: "I'll take you to our alumni directory where you can connect with other graduates.",
        isBot: true,
        action: '/alumni-directory'
      };
    }

    if (input.includes('profile') || input.includes('account')) {
      return {
        text: "Let me take you to your profile page.",
        isBot: true,
        action: '/profile'
      };
    }
    
    return {
      text: "I can help you with:\n• Finding jobs (try 'show available jobs')\n• Connecting with mentors (try 'list mentors')\n• Finding events\n• Browsing the alumni directory\n• Managing your profile\n\nWhat would you like to know more about?",
      isBot: true
    };
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Alumni Connect Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;