import { useState, useEffect, useCallback } from "react";
import TallyIntegratedChatBot from "@/components/TallyIntegratedChatBot";
import { AirtableContactData, AirtableResponse } from "@shared/api";

// Contact Form Modal Component
interface ContactFormModalProps {
  onClose: () => void;
}

function ContactFormModal({ onClose }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

  const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);
  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    return PHONE_REGEX.test(cleanPhone);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter a valid name";
    }

    if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData: AirtableContactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      const response = await fetch("/api/airtable/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      const result: AirtableResponse = await response.json();
      setIsSubmitting(false);
      setSubmitSuccess(true);

      if (result.tallyFormLink) {
        setTimeout(() => {
          window.open(result.tallyFormLink, "_blank");
          onClose();
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: "Failed to submit. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#1f2937",
            }}
          >
            Start Your Systems Assessment
          </h2>
          <p style={{ color: "#6b7280" }}>
            Let's discuss your automation needs
          </p>
        </div>

        {submitSuccess ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                color: "#3CDBC0",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Thank you!
            </h3>
            <p style={{ color: "#6b7280" }}>We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                placeholder="Your full name"
              />
              {errors.name && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.phone}
                </p>
              )}
            </div>

            {errors.submit && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                background: "#3CDBC0",
                color: "white",
                border: "none",
                padding: "0.875rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "all 0.3s ease",
              }}
            >
              {isSubmitting ? "Submitting..." : "Start Assessment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Smooth scroll function
  const smoothScrollToElement = useCallback((elementId: string) => {
    const element = document.querySelector(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 },
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: #ffffff;
          overflow-x: hidden;
        }

        /* Animation Classes */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in-left {
          opacity: 0;
          transform: translateX(-30px);
          animation: slideInLeft 0.8s ease-out forwards;
        }

        @keyframes slideInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .slide-in-right {
          opacity: 0;
          transform: translateX(30px);
          animation: slideInRight 0.8s ease-out forwards;
        }

        @keyframes slideInRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Hover Effects */
        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(60, 219, 192, 0.15);
        }

        .btn-hover:hover {
          background: #33bba6 !important;
        }

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .mobile-stack {
            flex-direction: column !important;
            text-align: center !important;
          }
          
          .mobile-hide {
            display: none !important;
          }
          
          .mobile-show {
            display: block !important;
          }
        }

        @media (max-width: 768px) {
          .mobile-text-center {
            text-align: center !important;
          }
          
          .mobile-full-width {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background:
            scrollY > 50
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom:
            scrollY > 50
              ? "1px solid rgba(60, 219, 192, 0.1)"
              : "1px solid rgba(229, 231, 235, 0.5)",
          zIndex: 1000,
          padding: "0.75rem 0",
          transition: "all 0.3s ease",
          boxShadow: scrollY > 50 ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1f2937",
              cursor: "pointer",
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Figures <span style={{ color: "#3CDBC0" }}>Solutions</span>
          </div>

          {/* Desktop Navigation */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
            }}
            className="mobile-hide"
          >
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToElement("#services");
              }}
              style={{
                textDecoration: "none",
                color: "#6b7280",
                fontWeight: "500",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
              onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
            >
              Services
            </a>
            <a
              href="#process"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToElement("#process");
              }}
              style={{
                textDecoration: "none",
                color: "#6b7280",
                fontWeight: "500",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
              onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
            >
              Process
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToElement("#about");
              }}
              style={{
                textDecoration: "none",
                color: "#6b7280",
                fontWeight: "500",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
              onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToElement("#contact");
              }}
              style={{
                textDecoration: "none",
                color: "#6b7280",
                fontWeight: "500",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
              onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
            >
              Contact
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-hover"
              style={{
                background: "#3CDBC0",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(60, 219, 192, 0.3)",
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-show"
            style={{
              display: "none",
              background: "transparent",
              border: "2px solid #e5e7eb",
              color: "#6b7280",
              padding: "0.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                borderBottom: "1px solid #e5e7eb",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  smoothScrollToElement("#services");
                }}
                style={{
                  textDecoration: "none",
                  color: "#6b7280",
                  fontWeight: "500",
                  padding: "0.5rem 0",
                }}
              >
                Services
              </a>
              <a
                href="#process"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  smoothScrollToElement("#process");
                }}
                style={{
                  textDecoration: "none",
                  color: "#6b7280",
                  fontWeight: "500",
                  padding: "0.5rem 0",
                }}
              >
                Process
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  smoothScrollToElement("#about");
                }}
                style={{
                  textDecoration: "none",
                  color: "#6b7280",
                  fontWeight: "500",
                  padding: "0.5rem 0",
                }}
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  smoothScrollToElement("#contact");
                }}
                style={{
                  textDecoration: "none",
                  color: "#6b7280",
                  fontWeight: "500",
                  padding: "0.5rem 0",
                }}
              >
                Contact
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                style={{
                  background: "#3CDBC0",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #f8fffe 0%, #ffffff 50%, #f0fdfc 100%)",
          position: "relative",
          paddingTop: "5rem",
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(60, 219, 192, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(60, 219, 192, 0.05) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 1,
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
          className="mobile-stack"
        >
          {/* Left: Content */}
          <div className="fade-in-up">
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(60, 219, 192, 0.1), rgba(60, 219, 192, 0.05))",
                color: "#1f2937",
                padding: "0.5rem 1rem",
                borderRadius: "25px",
                fontSize: "0.875rem",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "2rem",
                border: "1px solid rgba(60, 219, 192, 0.2)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#3CDBC0",
                  borderRadius: "50%",
                  animation: "pulse 2s infinite",
                }}
              />
              Automation • Systems • Growth
            </div>

            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: "800",
                lineHeight: "1.1",
                marginBottom: "1.5rem",
                color: "#1f2937",
                letterSpacing: "-0.02em",
              }}
            >
              Custom{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3CDBC0, #33bba6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Automation
              </span>{" "}
              & Systems Built for You
            </h1>

            <p
              style={{
                fontSize: "1.25rem",
                color: "#6b7280",
                marginBottom: "2rem",
                lineHeight: "1.7",
                maxWidth: "500px",
              }}
            >
              We build custom automation systems, CRM setups, and professional
              websites for small businesses, nonprofits, and sales teams. Guided
              by relationship-driven consulting and sustainable growth.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "3rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-hover"
                style={{
                  background: "#3CDBC0",
                  color: "white",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(60, 219, 192, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Start Your Systems Assessment
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button
                onClick={() => smoothScrollToElement("#services")}
                style={{
                  background: "transparent",
                  color: "#3CDBC0",
                  border: "2px solid #3CDBC0",
                  padding: "1rem 2rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#3CDBC0";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#3CDBC0";
                }}
              >
                See What We Do
              </button>
            </div>

            {/* Companies We Work With */}
            <div
              style={{
                padding: "1.5rem",
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "16px",
                border: "1px solid rgba(60, 219, 192, 0.1)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1rem",
                  fontWeight: "500",
                }}
              >
                Trusted partners and platforms we work with:
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { name: "Make.com", logo: "🔗" },
                  { name: "Airtable", logo: "📊" },
                  { name: "Zapier", logo: "⚡" },
                  { name: "HubSpot", logo: "📈" },
                  { name: "Notion", logo: "📝" },
                  { name: "Calendly", logo: "📅" },
                ].map((company, index) => (
                  <div
                    key={index}
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #3CDBC0, #33bba6)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      boxShadow: "0 4px 12px rgba(60, 219, 192, 0.3)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    title={company.name}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                      e.target.style.boxShadow =
                        "0 6px 20px rgba(60, 219, 192, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(60, 219, 192, 0.3)";
                    }}
                  >
                    {company.logo}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className="slide-in-right"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Dashboard Mock-up */}
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "400px",
                background: "linear-gradient(145deg, #ffffff, #f8fffe)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 25px 60px rgba(60, 219, 192, 0.15)",
                border: "1px solid rgba(60, 219, 192, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                  Automation Dashboard
                </div>
                <div
                  style={{
                    background: "#3CDBC0",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  Live
                </div>
              </div>

              {/* Workflow Visual */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                {[
                  { label: "CRM", icon: "👥", color: "#3CDBC0" },
                  { label: "Automation", icon: "⚡", color: "#33bba6" },
                  { label: "Analytics", icon: "📊", color: "#3CDBC0" },
                ].map((item, index) => (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                        padding: "1rem 1.5rem",
                        borderRadius: "12px",
                        border: `1px solid ${item.color}30`,
                        width: "250px",
                        animation: `slideIn 0.8s ease-out ${index * 0.2}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#1f2937",
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.label}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          Connected & Automated
                        </div>
                      </div>
                      <div
                        style={{
                          marginLeft: "auto",
                          width: "8px",
                          height: "8px",
                          background: item.color,
                          borderRadius: "50%",
                          animation: "pulse 2s infinite",
                        }}
                      />
                    </div>
                    {index < 2 && (
                      <div
                        style={{
                          width: "2px",
                          height: "20px",
                          background: "#3CDBC0",
                          margin: "0.5rem auto",
                          borderRadius: "1px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Floating Elements */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(60, 219, 192, 0.1)",
                  color: "#3CDBC0",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  fontSize: "1rem",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                ⚙️
              </div>
            </div>

            <style>{`
              @keyframes slideIn {
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
                from {
                  opacity: 0;
                  transform: translateX(-20px);
                }
              }
              
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section
        id="services"
        style={{
          padding: "6rem 0",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "4rem",
            }}
            className="animate-on-scroll"
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "#1f2937",
              }}
            >
              What We Do
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#6b7280",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              We specialize in building custom systems that save time, increase
              efficiency, and help you build sustainable growth.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: "🔧",
                title: "CRM Setup & Optimization",
                description:
                  "Custom HubSpot, Airtable, and Notion configurations that actually work for your business flow.",
                features: [
                  "Custom field configuration",
                  "Automated lead scoring",
                  "Pipeline optimization",
                  "Reporting dashboards",
                ],
                color: "#3CDBC0",
              },
              {
                icon: "⚡",
                title: "Workflow Automation",
                description:
                  "Zapier and Make integrations that connect your tools and eliminate manual work.",
                features: [
                  "Multi-platform integrations",
                  "Custom automation flows",
                  "Error handling & monitoring",
                  "Performance optimization",
                ],
                color: "#33bba6",
              },
              {
                icon: "📅",
                title: "Calendar & Email Automation",
                description:
                  "Smart scheduling systems and email sequences that nurture leads automatically.",
                features: [
                  "Automated appointment booking",
                  "Follow-up sequences",
                  "Lead nurturing campaigns",
                  "Meeting coordination",
                ],
                color: "#3CDBC0",
              },
              {
                icon: "🌐",
                title: "Website Design & Strategy",
                description:
                  "Professional websites that convert visitors into customers with integrated systems.",
                features: [
                  "Custom responsive design",
                  "CRM integration",
                  "Lead capture optimization",
                  "Performance analytics",
                ],
                color: "#33bba6",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="animate-on-scroll card-hover"
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "20px",
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease",
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: `linear-gradient(135deg, ${service.color}, ${service.color}cc)`,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    marginBottom: "1.5rem",
                    boxShadow: `0 8px 24px ${service.color}40`,
                  }}
                >
                  {service.icon}
                </div>

                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: "#1f2937",
                  }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    lineHeight: "1.7",
                    marginBottom: "1.5rem",
                  }}
                >
                  {service.description}
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    marginBottom: "1.5rem",
                  }}
                >
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.5rem 0",
                        color: "#4b5563",
                        fontSize: "0.9rem",
                      }}
                    >
                      <span style={{ color: service.color, fontWeight: "600" }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    width: "100%",
                    background: "transparent",
                    color: service.color,
                    border: `2px solid ${service.color}`,
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = service.color;
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = service.color;
                  }}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section
        id="process"
        style={{
          padding: "6rem 0",
          background: "linear-gradient(135deg, #f8fffe 0%, #ffffff 100%)",
          backgroundColor: "#1F2937",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "4rem",
            }}
            className="animate-on-scroll"
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "#1f2937",
              }}
            >
              How We Work
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#6b7280",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
               5-step process ensures your systems are built right,
              implemented smoothly, and supported long-term.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                step: "01",
                title: "Connect",
                description:
                  "We start with understanding your business, goals, and current challenges.",
                icon: "🤝",
              },
              {
                step: "02",
                title: "Discover",
                description:
                  "Deep dive into your current systems and identify optimization opportunities.",
                icon: "🔍",
              },
              {
                step: "03",
                title: "Analyze",
                description:
                  "Create a custom strategy and roadmap tailored to your specific needs.",
                icon: "📊",
              },
              {
                step: "04",
                title: "Deliver",
                description:
                  "Build and implement your new systems with rigorous testing and training.",
                icon: "🚀",
              },
              {
                step: "05",
                title: "Accountability",
                description:
                  "Ongoing support, monitoring, and optimization to ensure continued success.",
                icon: "🎯",
              },
            ].map((process, index) => (
              <div
                key={index}
                className="animate-on-scroll"
                style={{
                  flex: "1",
                  minWidth: "200px",
                  textAlign: "center",
                  position: "relative",
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {/* Step Number */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: index % 2 === 0 ? "#3CDBC0" : "#33bba6",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    margin: "0 auto 1rem auto",
                    boxShadow: `0 8px 24px ${index % 2 === 0 ? "#3CDBC0" : "#33bba6"}40`,
                  }}
                >
                  {process.step}
                </div>

                {/* Icon */}
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                  }}
                >
                  {process.icon}
                </div>

                {/* Content */}
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    marginBottom: "0.75rem",
                    color: "#1f2937",
                  }}
                >
                  {process.title}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    maxWidth: "200px",
                    margin: "0 auto",
                  }}
                >
                  {process.description}
                </p>

                {/* Connector Arrow */}
                {index < 4 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      right: "-20px",
                      color: "#3CDBC0",
                      fontSize: "1.5rem",
                      zIndex: 1,
                    }}
                    className="mobile-hide"
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        style={{
          padding: "6rem 0",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 2rem",
            textAlign: "center",
          }}
        >
          <div className="animate-on-scroll">
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "2rem",
                color: "#1f2937",
              }}
            >
              About Figures Solutions
            </h2>

            <div
              style={{
                background: "linear-gradient(135deg, #f8fffe, #ffffff)",
                border: "1px solid rgba(60, 219, 192, 0.1)",
                borderRadius: "20px",
                padding: "3rem",
                marginBottom: "2rem",
              }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#4b5563",
                  lineHeight: "1.8",
                  marginBottom: "2rem",
                }}
              >
                Founded on the principles of{" "}
                <span
                  style={{
                    color: "#3CDBC0",
                    fontWeight: "600",
                  }}
                >
                  stewardship, trust, and strategy
                </span>
                , we believe every business deserves systems that work as hard
                as they do.
              </p>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#6b7280",
                  lineHeight: "1.7",
                  marginBottom: "2rem",
                }}
              >
                 We're not just consultants—we're
                partners in your growth journey.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "2rem",
                  marginTop: "2rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    🎯
                  </div>
                  <h4
                    style={{
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: "#1f2937",
                    }}
                  >
                    Mission-Driven
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                    }}
                  >
                    Every system we build serves your larger purpose and goals.
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    🤝
                  </div>
                  <h4
                    style={{
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: "#1f2937",
                    }}
                  >
                    Relationship-First
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                    }}
                  >
                    We're not just vendors—we're long-term partners in your
                    success.
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    🌱
                  </div>
                  <h4
                    style={{
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: "#1f2937",
                    }}
                  >
                    Growth-Focused
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                    }}
                  >
                    We build systems that scale with your business and
                    ambitions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      
      {/* Contact / CTA Section */}
      <section
        id="contact"
        style={{
          padding: "6rem 0",
          background: "linear-gradient(135deg, #3CDBC0, #33bba6)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          <div className="animate-on-scroll">
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
              }}
            >
              Let's Build Better Systems Together
            </h2>

            <p
              style={{
                fontSize: "1.2rem",
                marginBottom: "2rem",
                opacity: 0.9,
                lineHeight: "1.7",
              }}
            >
              Ready to save time, increase efficiency, and build sustainable
              systems? Let's start with a free systems assessment.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "3rem",
              }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  background: "white",
                  color: "#3CDBC0",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
                }}
              >
                Book Your Free Assessment
              </button>

              <a
                href="mailto:hello@figuressolutions.com"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  padding: "1rem 2rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#3CDBC0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "white";
                }}
              >
                Email Us Directly
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2rem",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "2rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div>
                <h4
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  📧 Email
                </h4>
                <p style={{ opacity: 0.9 }}>hello@figuressolutions.com</p>
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  📞 Phone
                </h4>
                <p style={{ opacity: 0.9 }}>(616) 228-5159</p>
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  ⏱️ Response Time
                </h4>
                <p style={{ opacity: 0.9 }}>Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#1f2937",
          color: "white",
          padding: "3rem 0 2rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Figures <span style={{ color: "#3CDBC0" }}>Solutions</span>
              </div>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: "1.6",
                  marginBottom: "1rem",
                }}
              >
                Building custom automation systems, CRM setups, and professional
                websites for businesses that want to grow smarter, not harder.
              </p>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Services
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <a
                  href="#services"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255, 255, 255, 0.8)")
                  }
                >
                  CRM Setup
                </a>
                <a
                  href="#services"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255, 255, 255, 0.8)")
                  }
                >
                  Workflow Automation
                </a>
                <a
                  href="#services"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255, 255, 255, 0.8)")
                  }
                >
                  Website Design
                </a>
                <a
                  href="#services"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#3CDBC0")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255, 255, 255, 0.8)")
                  }
                >
                  System Integration
                </a>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Contact
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <p>📧 hello@figuressolutions.com</p>
                <p>📞 (616) 228-5159</p>
                <p>🌐 Grand Rapids, MI</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    background: "#3CDBC0",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    marginTop: "0.5rem",
                    width: "fit-content",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#33bba6")}
                  onMouseLeave={(e) => (e.target.style.background = "#3CDBC0")}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              paddingTop: "1.5rem",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.9rem",
            }}
          >
            <p>
              © 2024 Figures Solutions. All rights reserved. | Building better
              systems for better businesses.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Bot - Styled with Green Theme */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999,
        }}
      >
        <div
          style={{
            "--chatbot-primary-color": "#3CDBC0",
            "--chatbot-hover-color": "#33bba6",
            "--chatbot-text-color": "white",
          }}
        >
          <TallyIntegratedChatBot />
        </div>
      </div>

      {/* Contact Modal */}
      {isModalOpen && (
        <ContactFormModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
