import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Rewards = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
      const element = bar as HTMLElement;
      const width = element.style.width;
      element.style.width = '0';
      setTimeout(() => {
        element.style.width = width;
      }, 300);
    });

    // Fade in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.fade-in').forEach((el, index) => {
      const element = el as HTMLElement;
      element.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
    });

    // Add floating animation styles
    const style = document.createElement('style');
    style.textContent = `
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      .fade-in.show {
        opacity: 1;
        transform: translateY(0);
      }
      .reward-card {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .reward-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      }
      .progress-bar {
        transition: width 1.5s ease-in-out;
      }
      .pulse {
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .floating {
        animation: floating 3s ease-in-out infinite;
      }
      @keyframes floating {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-red-700 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-montserrat">Velveta Rewards</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">Your loyalty deserves the best perks. Earn points with every purchase and unlock exclusive benefits.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-white text-red-700 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300">
              Join Now
            </Link>
            <a href="#how-it-works" className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-red-700 transition-colors duration-300">
              How It Works
            </a>
          </div>
          <div className="mt-12 floating">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" 
              alt="Reward Cup" 
              className="w-32 h-32 mx-auto"
            />
          </div>
        </div>
      </section>

      {/* REWARDS PROGRESS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
          <div className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat">Your Rewards Progress</h2>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Silver Member</span>
                <span className="font-medium">150/300 points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="progress-bar bg-amber-500 h-4 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-xs">
                <div className="text-2xl font-bold text-red-700">5</div>
                <div className="text-gray-600 text-sm">Stars Collected</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-xs">
                <div className="text-2xl font-bold text-red-700">2</div>
                <div className="text-gray-600 text-sm">Free Drinks</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-xs">
                <div className="text-2xl font-bold text-red-700">1</div>
                <div className="text-gray-600 text-sm">Months Member</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 md:mb-16 font-montserrat">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="fade-in">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm h-full reward-card">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-red-700">1</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Join the Program</h3>
                <p className="text-gray-600 text-center">Sign up for free and start earning points immediately with every purchase.</p>
              </div>
            </div>
            
            <div className="fade-in">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm h-full reward-card">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-red-700">2</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Earn Points</h3>
                <p className="text-gray-600 text-center">Get 1 point for every Rp10,000 spent. Bonus points on special promotions.</p>
              </div>
            </div>
            
            <div className="fade-in">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm h-full reward-card">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-red-700">3</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Redeem Rewards</h3>
                <p className="text-gray-600 text-center">Exchange points for free drinks, discounts, and exclusive Velveta merchandise.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REWARD TIERS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 md:mb-16 font-montserrat">Reward Tiers</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Silver Tier */}
            <div className="fade-in">
              <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 rounded-xl h-full reward-card">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Silver</h3>
                  <p className="text-gray-600">0-299 points</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">5% discount on all purchases</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Free birthday drink</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Early access to new products</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-sm text-gray-500">Earn 300 points to reach Gold tier</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gold Tier */}
            <div className="fade-in">
              <div className="bg-amber-50 border border-amber-200 p-6 md:p-8 rounded-xl h-full reward-card transform scale-105 pulse">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m8-8v13m-8-13V8m-8 8v13" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Gold</h3>
                  <p className="text-gray-600">300-699 points</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">10% discount on all purchases</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Free drink every 5 purchases</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Exclusive Gold member events</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Free birthday dessert</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-sm text-gray-500">Earn 700 points to reach Platinum tier</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Platinum Tier */}
            <div className="fade-in">
              <div className="bg-gray-100 border border-gray-300 p-6 md:p-8 rounded-xl h-full reward-card">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Platinum</h3>
                  <p className="text-gray-600">700+ points</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">15% discount on all purchases</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Free drink every 3 purchases</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">VIP event invitations</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Free monthly specialty drink</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Personalized barista service</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-sm text-gray-500">You've reached the highest tier!</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gray-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN SECTION */}
      <section id="join" className="py-16 bg-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <h2 className="text-3xl font-bold mb-6 font-montserrat">Join Velveta Rewards Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Sign up now and get your first drink on us! Plus, earn double points for your first month.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button className="px-6 py-3 bg-white text-red-700 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300">
              Join Now
            </button>
          </div>
          <p className="text-sm mt-4 text-red-200">
            Already a member? <Link to="/login" className="underline">Sign in</Link>
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-montserrat">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              {
                question: "How do I earn points?",
                answer: "You earn 1 point for every Rp10,000 spent at any Velveta Coffee location. Just provide your phone number or scan your member QR code at checkout to earn points. Special promotions may offer bonus points on select items."
              },
              {
                question: "How do I redeem rewards?",
                answer: "You can redeem rewards through the Velveta mobile app or by telling your barista at checkout. Available rewards will be shown in your account based on your current point balance and membership tier."
              },
              {
                question: "Do points expire?",
                answer: "Points expire after 6 months of account inactivity. As long as you make at least one purchase every 6 months, your points will remain active. We'll send you reminders before any points are set to expire."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm fade-in">
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="faq-toggle w-full flex justify-between items-center"
                >
                  <h3 className="text-lg font-bold text-left text-gray-900">{faq.question}</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-red-700 transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`faq-content mt-3 text-gray-600 ${openFaq === index ? 'block' : 'hidden'}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );  
};

export default Rewards; 