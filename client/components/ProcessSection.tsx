import { useRef, useEffect } from "react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export default function ProcessSection() {
  const lottieRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    // Load modern Lottie animation
    const loadLottieAnimation = async () => {
      try {
        const lottie = await import("lottie-web");

        if (lottieRef.current) {
          // Modern workflow animation data
          const modernWorkflowData = {
            v: "5.7.4",
            fr: 30,
            ip: 0,
            op: 150,
            w: 400,
            h: 400,
            nm: "Modern Workflow",
            ddd: 0,
            assets: [],
            layers: [
              // Main central circle
              {
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Central Hub",
                sr: 1,
                ks: {
                  o: { a: 0, k: 100 },
                  r: {
                    a: 1,
                    k: [
                      { t: 0, s: [0] },
                      { t: 149, s: [360] },
                    ],
                  },
                  p: { a: 0, k: [200, 200, 0] },
                  s: { a: 0, k: [100, 100, 100] },
                },
                shapes: [
                  {
                    ty: "gr",
                    it: [
                      {
                        ty: "el",
                        p: { a: 0, k: [0, 0] },
                        s: { a: 0, k: [80, 80] },
                      },
                      {
                        ty: "fl",
                        c: { a: 0, k: [0.231, 0.51, 0.965, 1] }, // Modern blue
                        o: { a: 0, k: 100 },
                      },
                    ],
                  },
                ],
                ip: 0,
                op: 150,
              },
              // Orbiting elements
              {
                ddd: 0,
                ind: 2,
                ty: 4,
                nm: "Orbit 1",
                sr: 1,
                ks: {
                  o: { a: 0, k: 80 },
                  r: {
                    a: 1,
                    k: [
                      { t: 0, s: [0] },
                      { t: 149, s: [360] },
                    ],
                  },
                  p: {
                    a: 1,
                    k: [
                      { t: 0, s: [280, 200, 0] },
                      { t: 149, s: [280, 200, 0] },
                    ],
                  },
                  s: { a: 0, k: [60, 60, 100] },
                },
                shapes: [
                  {
                    ty: "gr",
                    it: [
                      {
                        ty: "el",
                        p: { a: 0, k: [0, 0] },
                        s: { a: 0, k: [30, 30] },
                      },
                      {
                        ty: "fl",
                        c: { a: 0, k: [0.024, 0.706, 0.545, 1] }, // Cyan
                        o: { a: 0, k: 100 },
                      },
                    ],
                  },
                ],
                ip: 0,
                op: 150,
              },
              // Additional orbit elements
              {
                ddd: 0,
                ind: 3,
                ty: 4,
                nm: "Orbit 2",
                sr: 1,
                ks: {
                  o: { a: 0, k: 70 },
                  r: {
                    a: 1,
                    k: [
                      { t: 0, s: [90] },
                      { t: 149, s: [450] },
                    ],
                  },
                  p: {
                    a: 1,
                    k: [
                      { t: 0, s: [200, 120, 0] },
                      { t: 149, s: [200, 120, 0] },
                    ],
                  },
                  s: { a: 0, k: [50, 50, 100] },
                },
                shapes: [
                  {
                    ty: "gr",
                    it: [
                      {
                        ty: "el",
                        p: { a: 0, k: [0, 0] },
                        s: { a: 0, k: [25, 25] },
                      },
                      {
                        ty: "fl",
                        c: { a: 0, k: [0.133, 0.698, 0.298, 1] }, // Green
                        o: { a: 0, k: 100 },
                      },
                    ],
                  },
                ],
                ip: 20,
                op: 150,
              },
            ],
          };

          animationRef.current = lottie.default.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: modernWorkflowData,
          });
        }
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
        // Modern fallback content
        if (lottieRef.current) {
          lottieRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 3rem;">
              <div style="text-align: center;">
                <div style="width: 8rem; height: 8rem; margin: 0 auto 2.4rem auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
                  <svg style="width: 4rem; height: 4rem; color: white;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 1.2rem; color: #0f172a;">Modern Process</h3>
                <p style="font-size: 1.4rem; color: #64748b;">Streamlined workflow visualization</p>
              </div>
            </div>
          `;
        }
      }
    };

    loadLottieAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  const processSteps: ProcessStep[] = [
    {
      number: "01",
      title: "Connect",
      description:
        "We start by understanding your business goals, challenges, and vision for automation.",
      icon: "🤝",
    },
    {
      number: "02",
      title: "Discover",
      description:
        "Deep dive into your current workflows to identify optimization opportunities.",
      icon: "🔍",
    },
    {
      number: "03",
      title: "Analyze",
      description:
        "Design comprehensive automation strategies tailored to your specific needs.",
      icon: "📊",
    },
    {
      number: "04",
      title: "Deliver",
      description:
        "Implement solutions with ongoing support and continuous improvement.",
      icon: "🚀",
    },
  ];

  return (
    <>
      {/* Modern Responsive Styles */}
      <style>{`
        /* Responsive Foundation */
        .process-section {
          font-size: 1.6rem;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        /* Modern Animation Framework */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(3rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .step-card {
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out;
        }

        .step-card:hover {
          transform: translateY(-0.8rem);
        }

        .step-number {
          transition: all 300ms ease;
        }

        .step-number:hover {
          transform: scale(1.1);
          box-shadow: 0 1rem 2rem rgba(59, 130, 246, 0.4);
        }

        /* Responsive Design */
        @media (max-width: 76.8rem) {
          .process-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }

          .step-card {
            padding: 2rem;
          }
        }

        @media (max-width: 48rem) {
          .step-card {
            padding: 1.6rem;
          }

          .step-number {
            width: 5rem;
            height: 5rem;
            font-size: 1.6rem;
          }
        }
      `}</style>

      <section
        className="process-section"
        style={{
          backgroundColor: "#ffffff",
          padding: "12rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "120rem",
            width: "90%",
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          {/* Modern Section Header */}
          <div style={{ textAlign: "center", marginBottom: "8rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "0.1rem solid rgba(59, 130, 246, 0.2)",
                borderRadius: "5rem",
                padding: "0.8rem 2.4rem",
                marginBottom: "3rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  color: "#3b82f6",
                }}
              >
                🎯 Our Process
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(3.6rem, 6vw, 6rem)",
                fontWeight: "800",
                lineHeight: "1.1",
                marginBottom: "2.4rem",
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Five-Phase System
            </h2>

            <p
              style={{
                fontSize: "clamp(1.6rem, 2.5vw, 2rem)",
                color: "#64748b",
                lineHeight: "1.6",
                maxWidth: "60ch",
                margin: "0 auto",
              }}
            >
              A proven methodology that transforms your business operations
              through intelligent automation
            </p>
          </div>

          {/* Modern Content Grid */}
          <div
            className="process-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6rem",
              alignItems: "center",
            }}
          >
            {/* Process Steps */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
            >
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="step-card"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "2.4rem",
                    padding: "3rem",
                    background: "rgba(255, 255, 255, 0.7)",
                    border: "0.1rem solid #e2e8f0",
                    borderRadius: "2rem",
                    boxShadow: "0 0.4rem 0.6rem -0.1rem rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(1rem)",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Step Number */}
                  <div
                    className="step-number"
                    style={{
                      width: "6rem",
                      height: "6rem",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      fontWeight: "800",
                      flexShrink: 0,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Step Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        marginBottom: "1.6rem",
                      }}
                    >
                      <span style={{ fontSize: "2.4rem" }}>{step.icon}</span>
                      <h3
                        style={{
                          fontSize: "2.2rem",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontSize: "1.6rem",
                        color: "#64748b",
                        lineHeight: "1.6",
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modern Animation Container */}
            <div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "0.1rem solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "3rem",
                  backdropFilter: "blur(1rem)",
                  boxShadow: "0 2rem 2.5rem -0.5rem rgba(0, 0, 0, 0.1)",
                  padding: "3rem",
                }}
              >
                <div
                  ref={lottieRef}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    maxWidth: "40rem",
                    margin: "0 auto",
                    minHeight: "40rem",
                    borderRadius: "2rem",
                  }}
                  role="img"
                  aria-label="Animated workflow process visualization"
                ></div>

                {/* Supporting Text */}
                <div style={{ textAlign: "center", marginTop: "2.4rem" }}>
                  <p
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "600",
                      color: "#64748b",
                    }}
                  >
                    Seamless automation that grows with your business
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
