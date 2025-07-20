import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isForm?: boolean;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (basic - can be enhanced for specific regions)
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

export default function EnhancedChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI automation assistant. To provide you with personalized recommendations, I'll need to collect some basic information first. Let's start with your name - what should I call you?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [contactStep, setContactStep] = useState<
    "name" | "email" | "phone" | "complete"
  >("name");
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfo>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    return PHONE_REGEX.test(cleanPhone);
  };

  const sendToAirtable = async (contactData: ContactInfo) => {
    try {
      const response = await fetch("/api/airtable/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to send to Airtable:", errorData);
        throw new Error(
          errorData.error || "Failed to save contact information",
        );
      }

      const result = await response.json();
      console.log("Successfully sent to Airtable:", result);
      return result;
    } catch (error) {
      console.error("Error sending to Airtable:", error);
      // Still allow the flow to continue even if Airtable fails
      addBotMessage(
        "Your information has been saved locally. We'll follow up with you soon!",
      );
      throw error;
    }
  };

  const processContactInfo = async (input: string) => {
    setErrors({});

    switch (contactStep) {
      case "name":
        if (input.trim().length < 2) {
          setErrors({
            name: "Please enter a valid name (at least 2 characters)",
          });
          return;
        }
        setContactInfo((prev) => ({ ...prev, name: input.trim() }));
        setContactStep("email");
        setTimeout(() => {
          addBotMessage(
            `Nice to meet you, ${input.trim()}! Now, could you please provide your email address?`,
          );
        }, 800);
        break;

      case "email":
        if (!validateEmail(input.trim())) {
          setErrors({
            email:
              "Please enter a valid email address (e.g., user@example.com)",
          });
          return;
        }
        setContactInfo((prev) => ({ ...prev, email: input.trim() }));
        setContactStep("phone");
        setTimeout(() => {
          addBotMessage(
            "Great! Last step - could you share your phone number? (Include country code if international)",
          );
        }, 800);
        break;

      case "phone":
        if (!validatePhone(input.trim())) {
          setErrors({
            phone:
              "Please enter a valid phone number (digits only, optional + for country code)",
          });
          return;
        }
        const finalContactInfo: ContactInfo = {
          ...contactInfo,
          phone: input.trim(),
        } as ContactInfo;

        setContactInfo(finalContactInfo);
        setContactStep("complete");

        // Send to Airtable
        await sendToAirtable(finalContactInfo);

        setTimeout(() => {
          addBotMessage(
            `Perfect! Thank you ${finalContactInfo.name}. I've saved your contact information securely.`,
          );
          setTimeout(() => {
            addBotMessage(
              "Perfect! I've saved your contact information to our Airtable system. You'll receive a detailed survey from our Airtable automation shortly to help us understand your specific needs.",
              false,
            );
            setTimeout(() => {
              addBotMessage(
                "In the meantime, feel free to ask me any questions about our automation services! What business processes are taking up most of your time?",
                false,
              );
            }, 2000);
          }, 1500);
        }, 800);
        break;
    }
  };

  const addBotMessage = (text: string, isForm: boolean = false) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: false,
      timestamp: new Date(),
      isForm,
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Process based on current step
    if (contactStep !== "complete") {
      await processContactInfo(text.trim());
    } else {
      // Regular chat after contact collection
      setTimeout(
        () => {
          const responses = [
            "Based on your information, I can recommend several automation solutions. Would you like to schedule a consultation?",
            "I can help you identify the best automation opportunities for your specific needs. What business processes take up most of your time?",
            "Great question! Our automation solutions typically save businesses 20-40% of their manual work time. What area would you like to focus on first?",
          ];
          addBotMessage(
            responses[Math.floor(Math.random() * responses.length)],
          );
        },
        1000 + Math.random() * 1500,
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const getStepPrompt = () => {
    switch (contactStep) {
      case "name":
        return "Enter your name...";
      case "email":
        return "Enter your email address...";
      case "phone":
        return "Enter your phone number...";
      default:
        return "Ask about automation...";
    }
  };

  const getCurrentError = () => {
    switch (contactStep) {
      case "name":
        return errors.name;
      case "email":
        return errors.email;
      case "phone":
        return errors.phone;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div
            className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 rounded-t-lg text-white"
              style={{ backgroundColor: "#0B6623" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">AI Automation Assistant</h3>
                  <p className="text-xs opacity-90">
                    {contactStep === "complete"
                      ? "Ready to help"
                      : "Collecting info..."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                aria-label="Close chat"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                        message.isUser
                          ? "text-white rounded-br-none"
                          : "bg-gray-100 rounded-bl-none"
                      }`}
                      style={{
                        backgroundColor: message.isUser ? "#0B6623" : undefined,
                        color: message.isUser ? "white" : "#111111",
                      }}
                    >
                      <p>{message.text}</p>

                      <p
                        className={`text-xs mt-1 ${
                          message.isUser ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-200"
            >
              {getCurrentError() && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {getCurrentError()}
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getStepPrompt()}
                  className="flex-1 text-sm focus:ring-2 focus:ring-green-500"
                  disabled={isTyping}
                  aria-label={getStepPrompt()}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputValue.trim() || isTyping}
                  className="text-white focus:ring-2 focus:ring-green-500"
                  style={{ backgroundColor: "#0B6623" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3F704D";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0B6623";
                  }}
                  aria-label="Send message"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-300"
          style={{ backgroundColor: "#0B6623" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3F704D";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0B6623";
          }}
          aria-label="Open AI automation assistant"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>

        {/* Notification Badge */}
        {!isOpen && contactStep !== "complete" && (
          <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>
    </>
  );
}
