import { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import "animate.css";
import "../../styles/Global.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const Home = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"info" | "success" | "error">(
    "info",
  );

  const showCustomAlert = (
    message: string,
    type: "info" | "success" | "error" = "info",
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Auto hide setelah 4 detik
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const handleJoinClick = () => {
    if (isLoggedIn) {
      showCustomAlert("You are already logged in! Redirecting to dashboard...");

      // Tunggu sebentar sebelum redirect agar alert terlihat
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      navigate("/register");
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src =
      "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97315.jpg";
    img.onload = () => {
      setIsImageLoaded(true);
      console.log("Hero image preloaded successfully");
    };
    img.onerror = () => {
      setHeroImageError(true);
      console.error("Hero image failed to load");
    };

    const timer = setTimeout(() => {
      // Initialize ScrollReveal hanya di desktop
      if (window.innerWidth >= 1024) {
        const scrollReveal = ScrollReveal({
          origin: "bottom",
          distance: "30px",
          duration: 1000,
          delay: 200,
          rotate: { x: 0, y: 0, z: 2 },
          opacity: 0,
          scale: 0.95,
          easing: "cubic-bezier(0.5, 0, 0, 0.1)",
          mobile: false, // Nonaktifkan di mobile
          reset: false,
          viewFactor: 0.2,
          viewOffset: { top: 0, right: 0, bottom: 50, left: 0 },
        });

        scrollReveal.reveal(".sr-reveal", {
          interval: 100,
          beforeReveal: (el: HTMLElement) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0) rotateZ(0)";
            el.style.filter = "blur(0)";
          },
          beforeReset: (el: HTMLElement) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px) rotateZ(2deg)";
            el.style.filter = "blur(2px)";
          },
        });

        scrollReveal.reveal("section:nth-of-type(odd)", {
          origin: "left",
          rotate: { z: -2 },
        });

        scrollReveal.reveal("section:nth-of-type(even)", {
          origin: "right",
          rotate: { z: 2 },
        });
      }

      // Intersection Observer untuk semua device
      const sections = document.querySelectorAll("section");
      const options = {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px",
      };

      const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;

            // Hanya terapkan animasi jika belum visible
            if (target.style.opacity !== "1") {
              target.style.transition =
                "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
              target.style.opacity = "1";
              target.style.transform = "translateY(0) scale(1)";
              target.style.filter = "blur(0)";

              // Efek glow sementara hanya di desktop
              if (window.innerWidth >= 768) {
                target.style.boxShadow = "0 0 30px rgba(155, 17, 30, 0.2)";
                setTimeout(() => {
                  target.style.boxShadow = "none";
                }, 1000);
              }
            }

            observer.unobserve(target);
          }
        });
      }, options);

      sections.forEach((section, index) => {
        // Skip hero section dari observer
        if (index === 0) return;

        const element = section as HTMLElement;
        element.style.opacity = "0";
        element.style.transform =
          window.innerWidth >= 768
            ? "translateY(40px) scale(0.98)"
            : "translateY(20px) scale(0.98)";
        element.style.filter =
          window.innerWidth >= 768 ? "blur(2px)" : "blur(1px)";
        element.style.willChange = "opacity, transform, filter";
        element.style.backfaceVisibility = "hidden";
        sectionObserver.observe(section);
      });

      // Logo animation hanya di desktop
      if (window.innerWidth >= 768) {
        const logo = document.querySelector(".logo-img");
        if (logo) {
          const logoElement = logo as HTMLElement;
          logoElement.addEventListener("mouseenter", () => {
            logoElement.style.transition =
              "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
            logoElement.style.transform = "rotate(15deg) scale(1.1)";

            const pulse = () => {
              logoElement.style.transform = "rotate(15deg) scale(1.15)";
              setTimeout(() => {
                logoElement.style.transform = "rotate(15deg) scale(1.1)";
              }, 300);
            };

            setTimeout(pulse, 150);
          });

          logoElement.addEventListener("mouseleave", () => {
            logoElement.style.transform = "rotate(0) scale(1)";
          });
        }
      }

      // Button effects
      const buttons = document.querySelectorAll(
        'button, .btn, a[role="button"]',
      );
      buttons.forEach((button) => {
        const buttonElement = button as HTMLElement;

        buttonElement.addEventListener("mouseenter", () => {
          buttonElement.style.transition =
            "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          buttonElement.style.transform = "translateY(-3px)";

          if (window.innerWidth >= 768) {
            buttonElement.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";

            if (
              buttonElement.classList.contains("cta-button") ||
              buttonElement.classList.contains("join")
            ) {
              buttonElement.style.boxShadow =
                "0 10px 25px rgba(155, 17, 30, 0.3)";
            }
          }
        });

        buttonElement.addEventListener("mouseleave", () => {
          buttonElement.style.transform = "translateY(0)";
          buttonElement.style.boxShadow = "none";
        });

        // Touch effect untuk mobile
        buttonElement.addEventListener("touchstart", () => {
          buttonElement.style.transform = "scale(0.95)";
        });

        buttonElement.addEventListener("touchend", () => {
          buttonElement.style.transform = "scale(1)";
        });
      });

      // Add floating animation styles
      const style = document.createElement("style");
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 600ms linear;
          pointer-events: none;
        }
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .hero-image-container {
          position: relative;
          overflow: hidden;
        }
        .hero-image-fallback {
          background: linear-gradient(135deg, #8B0000 0%, #B22222 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .hero-section {
            margin-top: 0.5rem !important;
          }
          .card-hover {
            transform: none !important;
            transition: none !important;
          }
          .floating-dots {
            display: none !important;
          }
        }
        
        /* Tablet optimizations */
        @media (min-width: 641px) and (max-width: 1023px) {
          .card-hover:hover {
            transform: translateY(-4px) !important;
          }
          .section-padding {
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover-effects {
            transform: none !important;
            box-shadow: none !important;
          }
          button:hover, .btn:hover {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `;
      document.head.appendChild(style);

      return () => {
        clearTimeout(timer);
        document.head.removeChild(style);

        // Cleanup event listeners
        buttons.forEach((button) => {
          const buttonElement = button as HTMLElement;
          buttonElement.onmouseenter = null;
          buttonElement.onmouseleave = null;
          buttonElement.ontouchstart = null;
          buttonElement.ontouchend = null;
        });
      };
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="pt-16 md:pt-20">
      {/* Global Alert Notification */}
      {showAlert && (
        <div className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div
            className={`
              mx-4 rounded-xl shadow-lg p-3 sm:p-4 backdrop-blur-sm border animate-slideDown
              ${
                alertType === "info"
                  ? "bg-white/95 border-red-200"
                  : alertType === "success"
                    ? "bg-green-50/95 border-green-200"
                    : "bg-red-50/95 border-red-200"
              }
            `}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div
                  className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                  ${alertType === "info" ? "bg-red-100" : alertType === "success" ? "bg-green-100" : "bg-red-100"}
                `}
                >
                  {alertType === "info" ? (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : alertType === "success" ? (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p
                  className={`
                    text-xs sm:text-sm font-medium
                    ${
                      alertType === "info"
                        ? "text-gray-900"
                        : alertType === "success"
                          ? "text-green-800"
                          : "text-red-800"
                    }
                  `}
                >
                  {alertType === "info"
                    ? "Already Signed In"
                    : alertType === "success"
                      ? "Success!"
                      : "Attention"}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  {alertMessage}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            {/* Progress bar untuk auto-hide */}
            <div className="mt-2 sm:mt-3">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`
                    h-full rounded-full animate-progress
                    ${
                      alertType === "info"
                        ? "bg-red-500"
                        : alertType === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                    }
                  `}
                  style={{ animationDuration: "4s" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="mt-4 md:mt-8 lg:mt-12 relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-red-700 text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col justify-center items-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 font-montserrat">
                The Spring Edit
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto">
                Fresh flavors, familiar joy.
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-red-700 transition-colors duration-300 text-sm sm:text-base active:scale-95 touch-manipulation"
              >
                View the menu
              </button>
            </div>

            {/* Hero Image */}
            <div
              className={`h-40 sm:h-48 md:h-64 lg:h-auto md:min-h-[350px] lg:min-h-[400px] bg-cover bg-center ${
                !isImageLoaded && !heroImageError
                  ? "bg-gray-200 animate-pulse"
                  : ""
              }`}
              style={{
                backgroundImage: heroImageError
                  ? "linear-gradient(135deg, #8B0000 0%, #B22222 100%)"
                  : `url('https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97315.jpg')`,
                position: "relative",
                backgroundPosition: "center 30%",
              }}
            >
              {heroImageError && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold p-4 text-center">
                  Velveta Spring Collection
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating dots - hide on mobile */}
        <div className="hidden md:block">
          <div
            className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-amber-800 opacity-30 floating"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="absolute top-1/3 right-20 w-6 h-6 rounded-full bg-amber-600 opacity-40 floating"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-5 h-5 rounded-full bg-amber-900 opacity-30 floating"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>
      </section>

      {/* Promotion Section 1 */}
      <section className="my-8 sm:my-12 md:my-16 lg:my-20 xl:my-24 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 sr-reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div
            className="h-40 sm:h-48 md:h-auto min-h-[200px] sm:min-h-[250px] md:min-h-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/736x/fe/dd/69/fedd693b88559124917599d42495b61e.jpg')",
              backgroundPosition: "center 40%",
            }}
          ></div>
          <div className="bg-amber-800 text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 flex flex-col justify-center items-center text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 font-montserrat">
              It's a great day for free coffee
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 max-w-md leading-relaxed">
              Start your Velveta<sup>®</sup> Rewards journey with a coffee on
              us. Join now and enjoy a free handcrafted drink with a qualifying
              purchase during your first week.*
            </p>
            <button
              onClick={handleJoinClick}
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-amber-800 transition-colors duration-300 text-sm sm:text-base active:scale-95 touch-manipulation"
            >
              Join now
            </button>
          </div>
        </div>
      </section>

      {/* Promotion Section 2 */}
      <section className="my-8 sm:my-12 md:my-16 lg:my-20 xl:my-24 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 sr-reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="order-2 md:order-1 bg-gray-700 text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 flex flex-col justify-center items-center text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 font-montserrat">
              Nondairy milk, no extra charge
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 max-w-md leading-relaxed">
              Customize your drink with your favorite nondairy milk—like soy,
              coconut, almond or oat—for no additional charge.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-gray-700 transition-colors duration-300 text-sm sm:text-base active:scale-95 touch-manipulation"
            >
              Order now
            </button>
          </div>
          <div
            className="order-1 md:order-2 h-40 sm:h-48 md:h-auto min-h-[200px] sm:min-h-[250px] md:min-h-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97469.jpg')",
              backgroundPosition: "center 40%",
            }}
          ></div>
        </div>
      </section>

      {/* Signature Blends Section */}
      <section className="my-8 sm:my-12 md:my-16 lg:my-20 xl:my-24 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 sr-reveal">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-montserrat">
          Top Customer Favorite
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 md:transform md:hover:-translate-y-2 card-hover">
            <div
              className="aspect-[4/3] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://globalassets.starbucks.com/digitalassets/products/bev/IcedShakenEspresso.jpg?impolicy=1by1_wide_topcrop_630')",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">
                Iced Shaken Espresso
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 md:mb-4">
                Cold Brew over ice, bold and smooth
              </p>
              <button className="text-red-700 font-semibold hover:underline text-xs sm:text-sm md:text-base active:text-red-800">
                Learn more
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 md:transform md:hover:-translate-y-2 card-hover">
            <div
              className="aspect-[4/3] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://globalassets.starbucks.com/digitalassets/products/bev/IcedMatchaTeaLatte.jpg?impolicy=1by1_wide_topcrop_630')",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">
                Matcha Latte
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 md:mb-4">
                Ceremonial grade matcha from Japan.
              </p>
              <button className="text-red-700 font-semibold hover:underline text-xs sm:text-sm md:text-base active:text-red-800">
                Learn more
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 md:transform md:hover:-translate-y-2 card-hover sm:col-span-2 lg:col-span-1">
            <div
              className="aspect-[4/3] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://globalassets.starbucks.com/digitalassets/products/bev/IcedBrownSugarOatmilkShakenEspresso.jpg?impolicy=1by1_wide_topcrop_630')",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">
                Iced Brown Sugar Oatmilk Shaken Espresso
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 md:mb-4">
                Brown Sugar With Strong Espresso
              </p>
              <button className="text-red-700 font-semibold hover:underline text-xs sm:text-sm md:text-base active:text-red-800">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer untuk mobile bottom navigation */}
      <div className="h-16 sm:h-20 md:hidden"></div>
    </main>
  );
};

export default Home;
