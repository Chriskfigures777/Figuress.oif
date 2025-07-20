import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NavigationProps {
  smoothScrollToElement: (elementId: string) => void;
}

export default function ModernNavigation({
  smoothScrollToElement,
}: NavigationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Process", href: "#process" },
  ];

  const handleNavClick = useCallback(
    (href: string) => {
      setIsMobileMenuOpen(false);
      setTimeout(() => smoothScrollToElement(href), 200);
    },
    [smoothScrollToElement],
  );

  return (
    <>
      {/* Modern Navigation Styles */}
      <style>{`
        /* Responsive Foundation */
        .modern-nav {
          font-size: 1.6rem;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        /* Modern Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .mobile-menu {
          animation: slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link {
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -0.4rem;
          left: 50%;
          width: 0;
          height: 0.2rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 0.1rem;
          transition: all 300ms ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .mobile-menu-item {
          transition: all 300ms ease;
        }

        .mobile-menu-item:hover {
          background: #f8fafc;
          transform: translateX(0.8rem);
        }

        /* Responsive Design */
        @media (max-width: 76.8rem) {
          .desktop-nav {
            display: none;
          }

          .mobile-nav {
            display: flex;
          }
        }

        @media (min-width: 76.8rem) {
          .desktop-nav {
            display: flex;
          }

          .mobile-nav {
            display: none;
          }
        }

        /* Modern Button Styles */
        .modern-button {
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-button:hover {
          transform: translateY(-0.2rem);
          box-shadow: 0 1rem 2rem rgba(59, 130, 246, 0.4);
        }
      `}</style>

      <header
        className="modern-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(2rem)",
          borderBottom: "0.1rem solid rgba(226, 232, 240, 0.8)",
          padding: "1.6rem 0",
        }}
      >
        <nav
          style={{
            maxWidth: "120rem",
            width: "90%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
          }}
        >
          {/* Modern Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "1.2rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                fontWeight: "800",
              }}
            >
              F
            </div>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Figures Solutions
            </span>
          </div>

          {/* Desktop Navigation */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3rem",
            }}
          >
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => smoothScrollToElement(item.href)}
                className="nav-link"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.6rem",
                  fontWeight: "500",
                  color: "#475569",
                  cursor: "pointer",
                  padding: "0.8rem 0",
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="desktop-nav">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <button
                  className="modern-button"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "1.2rem",
                    padding: "1.2rem 2.4rem",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    minHeight: "4.4rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  Get Started
                  <svg
                    width="1.6rem"
                    height="1.6rem"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </DialogTrigger>

              {/* Modern Dialog */}
              <DialogContent
                style={{
                  maxWidth: "50rem",
                  background: "rgba(255,255,255,0.98)",
                  backdropFilter: "blur(2rem)",
                  boxShadow: "0 2.5rem 5rem -1.2rem rgba(0,0,0,0.25)",
                  borderRadius: "2rem",
                  border: "0.1rem solid rgba(226, 232, 240, 0.8)",
                  padding: "3rem",
                }}
              >
                <DialogHeader>
                  <DialogTitle
                    style={{
                      fontSize: "2.4rem",
                      fontWeight: "700",
                      color: "#0f172a",
                      marginBottom: "1.6rem",
                    }}
                  >
                    Start Your Project
                  </DialogTitle>
                  <p
                    style={{
                      fontSize: "1.6rem",
                      color: "#64748b",
                      lineHeight: "1.6",
                      marginBottom: "3rem",
                    }}
                  >
                    Tell us about your project and we'll get back to you within
                    24 hours.
                  </p>
                </DialogHeader>

                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2.4rem",
                  }}
                >
                  <div>
                    <Label
                      htmlFor="name"
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.8rem",
                        display: "block",
                      }}
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      style={{
                        fontSize: "1.6rem",
                        padding: "1.2rem 1.6rem",
                        borderRadius: "1rem",
                        border: "0.1rem solid #d1d5db",
                        minHeight: "4.4rem",
                      }}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.8rem",
                        display: "block",
                      }}
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      style={{
                        fontSize: "1.6rem",
                        padding: "1.2rem 1.6rem",
                        borderRadius: "1rem",
                        border: "0.1rem solid #d1d5db",
                        minHeight: "4.4rem",
                      }}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="service"
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.8rem",
                        display: "block",
                      }}
                    >
                      Service Needed
                    </Label>
                    <Select>
                      <SelectTrigger
                        style={{
                          fontSize: "1.6rem",
                          padding: "1.2rem 1.6rem",
                          borderRadius: "1rem",
                          border: "0.1rem solid #d1d5db",
                          minHeight: "4.4rem",
                        }}
                      >
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">
                          Website Development
                        </SelectItem>
                        <SelectItem value="automation">
                          Workflow Automation
                        </SelectItem>
                        <SelectItem value="ai">AI Integration</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.8rem",
                        display: "block",
                      }}
                    >
                      Project Description
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      style={{
                        fontSize: "1.6rem",
                        padding: "1.2rem 1.6rem",
                        borderRadius: "1rem",
                        border: "0.1rem solid #d1d5db",
                        resize: "vertical",
                        minHeight: "10rem",
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="modern-button"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "1.2rem",
                      padding: "1.6rem 2.4rem",
                      fontSize: "1.6rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      minHeight: "4.8rem",
                      width: "100%",
                    }}
                  >
                    Send Message
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-nav"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.8rem",
              minHeight: "4.4rem",
              minWidth: "4.4rem",
              borderRadius: "0.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="2.4rem"
              height="2.4rem"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                color: "#475569",
                transform: isMobileMenuOpen ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 300ms ease",
              }}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Modern Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: "fixed",
                top: "8rem",
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(0.4rem)",
                zIndex: 999,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <div
              className="mobile-menu"
              style={{
                position: "fixed",
                top: "8rem",
                left: "2rem",
                right: "2rem",
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(2rem)",
                borderRadius: "2rem",
                boxShadow: "0 2rem 2.5rem -0.5rem rgba(0, 0, 0, 0.1)",
                border: "0.1rem solid rgba(226, 232, 240, 0.8)",
                zIndex: 1000,
                padding: "2.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="mobile-menu-item"
                    style={{
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      padding: "1.6rem 2rem",
                      fontSize: "1.8rem",
                      fontWeight: "500",
                      color: "#475569",
                      cursor: "pointer",
                      borderRadius: "1.2rem",
                      minHeight: "4.4rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.name}
                  </button>
                ))}

                <div style={{ marginTop: "1.6rem" }}>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="modern-button"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "1.2rem",
                      padding: "1.6rem 2.4rem",
                      fontSize: "1.6rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      width: "100%",
                      minHeight: "4.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.8rem",
                    }}
                  >
                    Get Started
                    <svg
                      width="1.6rem"
                      height="1.6rem"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
