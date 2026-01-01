import { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import "animate.css";
import "../../Global.css";

const Home = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  useEffect(() => {
    // Preload gambar utama
    const img = new Image();
    img.src = "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97315.jpg";
    img.onload = () => {
      setIsImageLoaded(true);
      console.log("Hero image preloaded successfully");
    };
    img.onerror = () => {
      setHeroImageError(true);
      console.error("Hero image failed to load");
    };

    // Delay inisialisasi ScrollReveal untuk memastikan DOM siap
    const timer = setTimeout(() => {
      const scrollReveal = ScrollReveal({
        origin: 'bottom',
        distance: '30px',
        duration: 1000,
        delay: 200,
        rotate: { x: 0, y: 0, z: 2 },
        opacity: 0,
        scale: 0.95,
        easing: 'cubic-bezier(0.5, 0, 0, 0.1)',
        mobile: true,
        reset: false,
        viewFactor: 0.2,
        viewOffset: { top: 0, right: 0, bottom: 50, left: 0 }
      });

      // Jangan reveal elemen yang sudah visible
      scrollReveal.reveal('.sr-reveal', {
        interval: 100,
        beforeReveal: (el: HTMLElement) => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) rotateZ(0)';
          el.style.filter = 'blur(0)';
        },
        beforeReset: (el: HTMLElement) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px) rotateZ(2deg)';
          el.style.filter = 'blur(2px)';
        }
      });

      scrollReveal.reveal('section:nth-of-type(odd)', {
        origin: 'left',
        rotate: { z: -2 }
      });

      scrollReveal.reveal('section:nth-of-type(even)', {
        origin: 'right',
        rotate: { z: 2 }
      });
    }, 300);

    // Intersection Observer untuk sections - DIUBAH
    const sections = document.querySelectorAll('section');
    const options = {
      threshold: 0.05, // Lower threshold
      rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          // Hanya terapkan animasi jika belum visible
          if (target.style.opacity !== '1') {
            target.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            target.style.opacity = '1';
            target.style.transform = 'translateY(0) scale(1)';
            target.style.filter = 'blur(0)';

            // Efek glow sementara
            target.style.boxShadow = '0 0 30px rgba(155, 17, 30, 0.2)';
            setTimeout(() => {
              target.style.boxShadow = 'none';
            }, 1000);
          }
          
          observer.unobserve(target);
        }
      });
    }, options);

    sections.forEach((section, index) => {
      // Skip hero section dari observer
      if (index === 0) return;
      
      const element = section as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(40px) scale(0.98)';
      element.style.filter = 'blur(2px)';
      element.style.willChange = 'opacity, transform, filter';
      element.style.backfaceVisibility = 'hidden';
      sectionObserver.observe(section);
    });

    // Logo animation
    const logo = document.querySelector('.logo-img');
    if (logo) { 
      const logoElement = logo as HTMLElement;
      logoElement.addEventListener('mouseenter', () => {
        logoElement.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        logoElement.style.transform = 'rotate(15deg) scale(1.1)';

        const pulse = () => {
          logoElement.style.transform = 'rotate(15deg) scale(1.15)';
          setTimeout(() => {
            logoElement.style.transform = 'rotate(15deg) scale(1.1)';
          }, 300);
        };

        setTimeout(pulse, 150);
      });

      logoElement.addEventListener('mouseleave', () => {
        logoElement.style.transform = 'rotate(0) scale(1)';
      });
    }

    // Button effects
    const buttons = document.querySelectorAll('button, .btn, a[role="button"]');
    buttons.forEach(button => {
      const buttonElement = button as HTMLElement;
      
      buttonElement.addEventListener('mouseenter', () => {
        buttonElement.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        buttonElement.style.transform = 'translateY(-3px)';
        buttonElement.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';

        if (buttonElement.classList.contains('cta-button') || buttonElement.classList.contains('join')) {
          buttonElement.style.boxShadow = '0 10px 25px rgba(155, 17, 30, 0.3)';
        }
      });

      buttonElement.addEventListener('mouseleave', () => {
        buttonElement.style.transform = 'translateY(0)';
        buttonElement.style.boxShadow = 'none';
      });
    });

    // Add floating animation styles
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main className="pt-16 md:pt-20">
      {/* Hero Section - DIUBAH MIRIP DENGAN BLADE */}
      <section className="mt-8 md:mt-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden">
          <div className="bg-red-700 text-white px-4 sm:px-6 py-12 md:py-20 lg:py-24 flex flex-col justify-center items-center text-center animate__animated animate__fadeInLeft">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-montserrat">
              The Spring Edit
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-md mx-auto px-2">
              Fresh flavors, familiar joy.
            </p>
            <button className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-red-700 transition-colors hero-btn text-sm sm:text-base">
              View the menu
            </button>
          </div>

          {/* Hero Image - DIUBAH MENGGUNAKAN BG COVER SEPERTI BLADE */}
          <div 
            className={`h-48 sm:h-64 md:h-auto min-h-[300px] md:min-h-0 bg-cover bg-center animate__animated animate__fadeInRight ${!isImageLoaded && !heroImageError ? 'bg-gray-200 animate-pulse' : ''}`}
            style={{
              backgroundImage: heroImageError 
                ? 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)' 
                : `url('https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97315.jpg')`,
              position: 'relative'
            }}
          >
            {heroImageError && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                Velveta Spring Collection
              </div>
            )}
          </div>
        </div>
        
        {/* Floating dots - hide on mobile */}
        <div className="hidden md:block absolute top-1/4 left-10 w-8 h-8 rounded-full bg-amber-800 opacity-30 floating" style={{ animationDelay: '0.2s' }}></div>
        <div className="hidden md:block absolute top-1/3 right-20 w-6 h-6 rounded-full bg-amber-600 opacity-40 floating" style={{ animationDelay: '0.4s' }}></div>
        <div className="hidden md:block absolute bottom-1/4 left-1/4 w-5 h-5 rounded-full bg-amber-900 opacity-30 floating" style={{ animationDelay: '0.6s' }}></div>
      </section>

      {/* Promotion Section 1 */}
      <section className="my-10 md:my-16 lg:my-24 max-w-7xl mx-auto px-4 sr-reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-xl transform transition-all hover:scale-[1.01] duration-500">
          <div 
            className="h-48 sm:h-64 md:h-auto bg-cover bg-center min-h-[250px] md:min-h-0" 
            style={{ backgroundImage: "url('https://i.pinimg.com/736x/fe/dd/69/fedd693b88559124917599d42495b61e.jpg')" }}
          ></div>
          <div className="bg-amber-800 text-white px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col justify-center items-center text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 font-montserrat px-2">It's a great day for free coffee</h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-md px-2">
              Start your Velveta<sup>®</sup> Rewards journey with a coffee on us. Join now and enjoy a free handcrafted drink with a qualifying purchase during your first week.*
            </p>
            <button className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-amber-800 transition-colors duration-300 hero-btn text-sm sm:text-base">
              Join now
            </button>
          </div>
        </div>
      </section>

      {/* Promotion Section 2 */}
      <section className="my-10 md:my-16 lg:my-24 max-w-7xl mx-auto px-4 sr-reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-xl transform transition-all hover:scale-[1.01] duration-500">
          <div className="order-2 md:order-1 bg-gray-700 text-white px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col justify-center items-center text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 font-montserrat px-2">Nondairy milk, no extra charge</h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-md px-2">
              Customize your drink with your favorite nondairy milk—like soy, coconut, almond or oat—for no additional charge.
            </p>
            <button className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-gray-700 transition-colors duration-300 hero-btn text-sm sm:text-base">
              Order now
            </button>
          </div>
          <div 
            className="order-1 md:order-2 h-48 sm:h-64 md:h-auto bg-cover bg-center min-h-[250px] md:min-h-0" 
            style={{ backgroundImage: "url('https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97469.jpg')" }}
          ></div>
        </div>
      </section>

      {/* Signature Blends Section */}
      <section className="my-10 md:my-16 lg:my-24 max-w-7xl mx-auto px-4 sr-reveal">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-montserrat">Our Signature Blends</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
            <div 
              className="h-48 sm:h-56 md:h-64 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
            ></div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Velveta Black</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 md:mb-4">Our signature dark roast with notes of chocolate and caramel.</p>
              <button className="text-red-700 font-semibold hover:underline text-sm sm:text-base">Learn more</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2">
            <div 
              className="h-48 sm:h-56 md:h-64 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
            ></div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Caramel Cloud</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 md:mb-4">Creamy caramel meets our premium espresso in this fan favorite.</p>
              <button className="text-red-700 font-semibold hover:underline text-sm sm:text-base">Learn more</button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
            <div 
              className="h-48 sm:h-56 md:h-64 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
            ></div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Spring Bloom</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 md:mb-4">Limited edition floral notes with a hint of citrus.</p>
              <button className="text-red-700 font-semibold hover:underline text-sm sm:text-base">Learn more</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;