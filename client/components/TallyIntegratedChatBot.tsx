import { useState, useRef, useEffect, useCallback } from "react";
import { AirtableContactData, AirtableResponse } from "@shared/api";

declare global {
  interface Window {
    vhTimeout?: NodeJS.Timeout;
  }
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  isLink?: boolean;
  linkUrl?: string;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  serviceType?: string;
}

// Email and phone validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// Service keywords for intent detection
const SERVICE_KEYWORDS = {
  website: [
    "website",
    "web",
    "site",
    "web design",
    "web development",
    "landing page",
    "redesign",
    "redo my website",
    "new website",
    "website redesign",
    "rebuild website",
  ],
  automation: [
    "automation",
    "automate",
    "workflow",
    "zapier",
    "make",
    "process",
  ],
  ai: [
    "ai",
    "artificial intelligence",
    "machine learning",
    "chatbot",
    "intelligent",
  ],
  crm: ["crm", "customer management", "database", "contact management"],
  forms: ["form", "forms", "survey", "tally", "typeform"],
  general: [
    "help",
    "service",
    "solution",
    "system",
    "build",
    "create",
    "develop",
  ],
};

// Contact intent keywords
const CONTACT_KEYWORDS = [
  "talk",
  "speak",
  "call",
  "phone",
  "contact",
  "human",
  "person",
  "owner",
  "christopher",
];

// Keywords that indicate uncertainty or need for clarification
const UNCERTAINTY_KEYWORDS = [
  "i don't know",
  "not sure",
  "uncertain",
  "confused",
  "help me understand",
  "what do you mean",
  "i'm not sure",
  "don't understand",
];

// Keywords that suggest they want to explore options
const EXPLORATION_KEYWORDS = [
  "options",
  "what can you do",
  "what do you offer",
  "tell me more",
  "learn more",
  "what services",
  "what kind of",
];

const detectServiceIntent = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return service;
    }
  }
  return null;
};

const detectContactIntent = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return CONTACT_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
};

const detectUncertainty = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return UNCERTAINTY_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
};

const detectExploration = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return EXPLORATION_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
};

export default function TallyIntegratedChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [contactStep, setContactStep] = useState<
    "welcome" | "name" | "email" | "phone" | "complete" | "ready"
  >("ready");
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfo>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer1 = setTimeout(() => {
        addBotMessage("🌿 Welcome to Figures Solutions!");
        const timer2 = setTimeout(() => {
          addBotMessage(
            "I'm here to help you grow your business with intelligent automation. What can I help you with today?",
          );
          setContactStep("welcome");
        }, 1000);
        return () => clearTimeout(timer2);
      }, 500);
      return () => clearTimeout(timer1);
    }
  }, [isOpen, messages.length]);

  // Auto-open chat widget after 6 seconds
  useEffect(() => {
    const AUTO_OPEN_DELAY = 6000;
    const STORAGE_KEY = "chatbot_auto_opened";

    const hasAutoOpened = sessionStorage.getItem(STORAGE_KEY);

    if (!hasAutoOpened && !isOpen) {
      const timer = setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setIsOpen(true);
      }, AUTO_OPEN_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const addBotMessage = useCallback(
    (text: string, isTyping = false, isLink = false, linkUrl?: string) => {
      const botMessage: Message = {
        id: Date.now().toString() + Math.random(),
        text,
        isUser: false,
        timestamp: new Date(),
        isTyping,
        isLink,
        linkUrl,
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    [],
  );

  const addUserMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  }, []);

  const submitToAirtable = useCallback(
    async (contactData: ContactInfo) => {
      setIsProcessing(true);

      try {
        const response = await fetch("/api/airtable/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        });

        if (!response.ok) {
          throw new Error("Failed to save contact information");
        }

        const result: AirtableResponse = await response.json();

        setTimeout(() => {
          addBotMessage(`🎉 Thanks ${result.clientName}! You're all set.`);
          setTimeout(() => {
            if (result.tallyFormLink) {
              addBotMessage("Here's your personalized survey to get started:");
              addBotMessage(
                "📋 Click here to open your survey",
                false,
                true,
                result.tallyFormLink,
              );
            }

            if (
              contactInfo.serviceType === "contact" ||
              detectContactIntent(contactInfo.serviceType || "")
            ) {
              addBotMessage(
                "📞 You can also call Christopher directly at (616) 228-5159",
              );
            } else {
              addBotMessage(
                "🌱 Our team will review your information and get back to you soon!",
              );
            }

            setContactStep("complete");
            setIsProcessing(false);
          }, 1500);
        }, 800);

        return result;
      } catch (error) {
        setTimeout(() => {
          addBotMessage(
            "⚠️ I'm having trouble saving your information. Please try again or call us at (616) 228-5159.",
          );
          setIsProcessing(false);
        }, 1000);
        throw error;
      }
    },
    [addBotMessage, contactInfo.serviceType],
  );

  const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);
  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    return PHONE_REGEX.test(cleanPhone);
  };

  const processContactInfo = useCallback(
    async (input: string) => {
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
            addBotMessage(`🌟 Nice to meet you, ${input.trim()}!`);
            setTimeout(
              () => addBotMessage("📧 What's your email address?"),
              1000,
            );
          }, 600);
          break;

        case "email":
          if (!validateEmail(input.trim())) {
            setErrors({ email: "Please enter a valid email address" });
            return;
          }
          setContactInfo((prev) => ({ ...prev, email: input.trim() }));
          setContactStep("phone");
          setTimeout(() => {
            addBotMessage("✅ Perfect!");
            setTimeout(
              () =>
                addBotMessage(
                  "📱 And what's the best phone number to reach you?",
                ),
              1000,
            );
          }, 600);
          break;

        case "phone":
          if (!validatePhone(input.trim())) {
            setErrors({ phone: "Please enter a valid phone number" });
            return;
          }

          const finalContactInfo: ContactInfo = {
            ...contactInfo,
            phone: input.trim(),
          } as ContactInfo;

          setContactInfo(finalContactInfo);
          setTimeout(() => {
            addBotMessage(
              "🚀 Got it! Let me set everything up for you...",
              true,
            );
          }, 600);

          await submitToAirtable(finalContactInfo);
          break;
      }
    },
    [contactStep, contactInfo, addBotMessage, submitToAirtable],
  );

  const handleWelcomeResponse = useCallback(
    (input: string) => {
      const serviceIntent = detectServiceIntent(input);
      const contactIntent = detectContactIntent(input);
      const uncertaintyIntent = detectUncertainty(input);
      const explorationIntent = detectExploration(input);

      // Handle uncertainty - direct them to contact
      if (uncertaintyIntent) {
        setTimeout(() => {
          addBotMessage(
            "🤔 No problem! When you're not sure what you need, the best thing is to talk with Christopher directly.",
          );
          setTimeout(() => {
            addBotMessage(
              "He can help figure out exactly what would work best for your business. Should I set that up for you?",
            );
          }, 1200);
        }, 600);
        return;
      }

      // Handle exploration requests - show services then ask next step
      if (explorationIntent) {
        setTimeout(() => {
          addBotMessage("🌟 Great question! We help businesses with:");
          setTimeout(() => {
            addBotMessage(
              "🌐 Website development & redesigns\n⚡ Business automation & workflows\n🤖 AI solutions & integrations\n📊 CRM & data management",
            );
            setTimeout(() => {
              addBotMessage(
                "Does any of this sound like what you need? Or would you like to discuss your specific situation with Christopher?",
              );
            }, 1500);
          }, 1200);
        }, 600);
        return;
      }

      // Handle direct contact requests
      if (contactIntent) {
        setContactInfo((prev) => ({ ...prev, serviceType: "contact" }));
        setTimeout(() => {
          addBotMessage("🤝 Perfect! I'll get you connected with Christopher.");
          setTimeout(() => {
            addBotMessage("🌱 What's your name?");
            setContactStep("name");
          }, 1000);
        }, 600);
        return;
      }

      // Handle specific service requests
      if (serviceIntent) {
        const serviceResponses = {
          website:
            "🌐 Excellent! Website redesigns are one of our specialties. We build modern, fast websites that actually help your business grow.",
          automation:
            "⚡ Smart choice! Business automation can save you hours every week. We set up systems that handle repetitive tasks automatically.",
          ai: "🤖 Perfect! AI can transform how your business operates. We build intelligent systems that make your work easier and more efficient.",
          crm: "📊 Great idea! A good CRM system can completely change how you manage customers. We set up complete systems that actually get used.",
          forms:
            "📝 Smart! Good forms can capture better leads and automate follow-ups. We create forms that integrate with your whole workflow.",
          general:
            "🌿 I'd love to help you build something that actually works for your business!",
        };

        const response =
          serviceResponses[serviceIntent as keyof typeof serviceResponses] ||
          serviceResponses.general;
        setContactInfo((prev) => ({ ...prev, serviceType: serviceIntent }));

        setTimeout(() => {
          addBotMessage(response);
          setTimeout(() => {
            addBotMessage(
              "To get started, I'll need your contact information so Christopher can provide you with a personalized solution. What's your name?",
            );
            setContactStep("name");
          }, 1500);
        }, 600);
        return;
      }

      // Simple fallback - just ask what they need help with
      setTimeout(() => {
        addBotMessage(
          "🌿 I can help you with websites, automation, AI solutions, or connect you directly with Christopher.",
        );
        setTimeout(() => {
          addBotMessage("What are you looking to get help with today?");
        }, 1000);
      }, 600);
    },
    [addBotMessage],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isProcessing) return;

      addUserMessage(text);
      setInputValue("");

      if (contactStep === "welcome") {
        handleWelcomeResponse(text.trim());
      } else if (contactStep !== "complete") {
        await processContactInfo(text.trim());
      } else {
        // Handle post-completion messages more intelligently
        const lowerInput = text.toLowerCase();

        // Check if they're asking about something new
        const newServiceIntent = detectServiceIntent(text);
        const newContactIntent = detectContactIntent(text);
        const newUncertaintyIntent = detectUncertainty(text);

        if (newContactIntent) {
          setTimeout(() => {
            addBotMessage(
              "📞 You can call Christopher directly at (616) 228-5159, or he'll be reaching out to you soon based on the information you provided!",
            );
          }, 600);
        } else if (newServiceIntent) {
          setTimeout(() => {
            addBotMessage(
              "🌟 That's another great service we offer! Since you've already provided your contact info, Christopher will be able to discuss that with you when he reaches out.",
            );
            setTimeout(() => {
              addBotMessage(
                "Or if you'd like to talk about it right away, feel free to give him a call at (616) 228-5159!",
              );
            }, 1200);
          }, 600);
        } else if (newUncertaintyIntent) {
          setTimeout(() => {
            addBotMessage(
              "🤝 No problem! Christopher will be able to answer any questions when he contacts you. You can also call him directly at (616) 228-5159 if you'd like to chat sooner.",
            );
          }, 600);
        } else {
          // More helpful general responses
          const helpfulResponses = [
            "🌱 Thanks for that additional info! Christopher will see this when he reviews your submission and can address it when he contacts you.",
            "🌿 Great! I've noted that down. Christopher will be able to discuss this with you in detail when he reaches out.",
            "🌟 Perfect! That's exactly the kind of detail that will help Christopher provide you with the best solution when he calls.",
            "💚 Excellent question! Christopher will have all this context when he contacts you and can give you a thorough answer.",
          ];

          setTimeout(() => {
            addBotMessage(
              helpfulResponses[
                Math.floor(Math.random() * helpfulResponses.length)
              ],
            );
            setTimeout(() => {
              addBotMessage(
                "Is there anything else you'd like me to pass along, or would you prefer to call Christopher directly at (616) 228-5159?",
              );
            }, 1500);
          }, 800);
        }
      }
    },
    [
      isProcessing,
      contactStep,
      addUserMessage,
      handleWelcomeResponse,
      processContactInfo,
      addBotMessage,
    ],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
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

  const getPlaceholder = () => {
    switch (contactStep) {
      case "welcome":
        return "Tell me what you need help with...";
      case "name":
        return "Enter your name...";
      case "email":
        return "Enter your email...";
      case "phone":
        return "Enter your phone number...";
      default:
        return "Type a message...";
    }
  };

  return (
    <>
      {/* HubSpot-style Chat Widget */}
      <div className="chat-widget-container">
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="chat-toggle-btn"
          aria-label={isOpen ? "Close chat" : "Open chat support"}
        >
          <div className="chat-toggle-content">
            {isOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div className="chat-notification-dot"></div>
              </>
            )}
          </div>
        </button>

        {/* Chat Container */}
        {isOpen && (
          <div className="chat-container">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-avatar">
                  <span>🌿</span>
                </div>
                <div className="chat-header-text">
                  <h3>Figures Solutions</h3>
                  <p>Typically replies in a few minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="chat-header-close"
                aria-label="Close chat"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {/* Error Message */}
              {getCurrentError() && (
                <div className="chat-error">{getCurrentError()}</div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${
                    message.isUser ? "chat-message--user" : "chat-message--bot"
                  }`}
                >
                  {!message.isUser && (
                    <div className="chat-message-avatar">
                      <span>🌿</span>
                    </div>
                  )}

                  <div className="chat-message-content">
                    {message.isTyping ? (
                      <div className="chat-typing">
                        <div className="chat-typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    ) : (
                      <div className="chat-message-bubble">
                        {message.isLink && message.linkUrl ? (
                          <a
                            href={message.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="chat-message-link"
                          >
                            {message.text}
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path
                                d="M7 17l9.2-9.2M17 17V7H7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        ) : (
                          message.text
                        )}
                      </div>
                    )}

                    {!message.isTyping && (
                      <div className="chat-message-time">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
              <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={getPlaceholder()}
                    disabled={isProcessing}
                    className="chat-input"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isProcessing}
                    className="chat-send-btn"
                    aria-label="Send message"
                  >
                    {isProcessing ? (
                      <div className="chat-spinner"></div>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* HubSpot-inspired Professional Chat Styles */}
      <style>{`
        /* Base Chat Widget Container */
        .chat-widget-container {
          position: fixed;
          bottom: 40px;
          right: 20px;
          z-index: 1001;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }

                /* Chat Toggle Button */
                .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3CDBC0 0%, #33bba6 100%) !important;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white !important;
          box-shadow: 0 4px 16px rgba(60, 219, 192, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

                                .chat-toggle-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(60, 219, 192, 0.5) !important;
          background: linear-gradient(135deg, #33bba6 0%, #2da089 100%) !important;
        }

        .chat-toggle-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

                .chat-notification-dot {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 12px;
          height: 12px;
                    background: #3CDBC0 !important;
          border: 2px solid white !important;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        /* Chat Container */
        .chat-container {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 20rem;
          height: 30rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

                                /* Chat Header */
        .chat-header {
          background: linear-gradient(135deg, #3CDBC0 0%, #33bba6 100%) !important;
          color: white !important;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .chat-header-text h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.2;
        }

        .chat-header-text p {
          margin: 0;
          font-size: 13px;
          opacity: 0.8;
          line-height: 1.2;
        }

        .chat-header-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .chat-header-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Messages Area */
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8fafc;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        /* Error Message */
        .chat-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          border: 1px solid #fecaca;
        }

        /* Messages */
        .chat-message {
          display: flex;
          margin-bottom: 16px;
          animation: messageSlide 0.3s ease-out;
        }

        .chat-message--user {
          justify-content: flex-end;
        }

        .chat-message--bot {
          justify-content: flex-start;
        }

        .chat-message-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          margin-right: 8px;
          flex-shrink: 0;
          align-self: flex-start;
        }

        .chat-message-content {
          max-width: 75%;
        }

        .chat-message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.4;
          word-wrap: break-word;
        }

                                .chat-message--user .chat-message-bubble {
          background: linear-gradient(135deg, #3CDBC0 0%, #33bba6 100%) !important;
          color: white !important;
        }

        .chat-message--bot .chat-message-bubble {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .chat-message-time {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
          text-align: right;
        }

        .chat-message--bot .chat-message-time {
          text-align: left;
        }

        /* Message Links */
        .chat-message-link {
          color: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .chat-message-link:hover {
          text-decoration: underline;
        }

        /* Typing Indicator */
        .chat-typing {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 12px 16px;
        }

        .chat-typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .chat-typing-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: typing 1.4s ease-in-out infinite;
        }

        .chat-typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chat-typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Input Area */
        .chat-input-area {
          padding: 20px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .chat-input-form {
          width: 100%;
        }

        .chat-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 4px;
          transition: border-color 0.2s ease;
        }

                                .chat-input-wrapper:focus-within {
          border-color: #3CDBC0 !important;
          box-shadow: 0 0 0 3px rgba(60, 219, 192, 0.1) !important;
        }

        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 16px;
          font-size: 15px;
          outline: none;
          color: #374151;
        }

        .chat-input::placeholder {
          color: #9ca3af;
        }

                                .chat-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3CDBC0 0%, #33bba6 100%) !important;
          border: none;
          color: white !important;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

                                .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(60, 219, 192, 0.3) !important;
          background: linear-gradient(135deg, #33bba6 0%, #2da089 100%) !important;
        }

        .chat-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Animations */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Tablet Responsiveness (769px - 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .chat-container {
            width: 350px;
            height: 550px;
          }

          .chat-message-bubble {
            font-size: 16px;
          }

          .chat-input {
            font-size: 16px;
          }
        }

        /* Small Tablet/Large Mobile (481px - 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
          .chat-widget-container {
            bottom: 16px;
            right: 16px;
          }

          .chat-container {
            width: calc(100vw - 32px);
            max-width: 340px;
            height: 70vh;
            max-height: 500px;
          }

          .chat-message-bubble {
            font-size: 16px;
          }

          .chat-input {
            font-size: 16px;
          }
        }

        /* Hide completely on very small mobile screens (HubSpot approach) */
        @media (max-width: 480px) {
          .chat-widget-container {
            display: none;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .chat-toggle-btn,
          .chat-container,
          .chat-message,
          .chat-typing-dots span,
          .chat-notification-dot {
            animation: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .chat-container {
            border: 2px solid #000;
          }

          .chat-message--bot .chat-message-bubble {
            border: 2px solid #000;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .chat-container {
            background: #1f2937;
          }

          .chat-messages {
            background: #111827;
          }

          .chat-message--bot .chat-message-bubble {
            background: #374151;
            color: #f9fafb;
            border-color: #4b5563;
          }

          .chat-input-area {
            background: #1f2937;
            border-color: #4b5563;
          }

          .chat-input-wrapper {
            background: #374151;
            border-color: #4b5563;
          }

          .chat-input {
            color: #f9fafb;
          }

          .chat-input::placeholder {
            color: #9ca3af;
          }
        }
      `}</style>
    </>
  );
}
