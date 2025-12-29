import { useEffect, useState } from "react";

const Rewards = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Fade in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => {
      el.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition-all",
        "duration-700"
      );
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-red-700 to-amber-900 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Velveta Rewards
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          Earn points with every purchase and unlock exclusive perks.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#join" className="px-8 py-3 bg-white text-red-700 rounded-full font-bold">
            Join Now
          </a>
          <a href="#how" className="px-8 py-3 border-2 border-white rounded-full font-bold">
            How It Works
          </a>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 fade-in">
          <div className="bg-gray-50 p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">
              Your Rewards Progress
            </h2>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Silver Member</span>
                <span>150 / 300</span>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded-full">
                <div className="bg-amber-500 h-4 rounded-full w-1/2"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <Stat title="Stars" value="5" />
              <Stat title="Free Drinks" value="2" />
              <Stat title="Months" value="1" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          {[
            ["Join", "Sign up and start earning points"],
            ["Earn", "1 point per Rp10.000 spent"],
            ["Redeem", "Exchange points for rewards"],
          ].map((item, i) => (
            <div key={i} className="fade-in bg-white p-8 rounded-xl shadow text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4 text-red-700 font-bold">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-2">{item[0]}</h3>
              <p className="text-gray-600">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="py-16 bg-red-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join Velveta Rewards Today
        </h2>
        <p className="mb-6">
          Sign up now and get double points in your first month!
        </p>

        <div className="flex justify-center gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email"
            className="px-4 py-3 rounded-full text-gray-900 w-full"
          />
          <button className="px-6 py-3 bg-white text-red-700 rounded-full font-bold">
            Join
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          FAQ
        </h2>

        <div className="max-w-4xl mx-auto space-y-4 px-4">
          {faqData.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow fade-in">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex justify-between w-full font-bold"
              >
                {faq.q}
                <span className={`transition ${openFaq === i ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-4 text-gray-600">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Rewards;

/* COMPONENTS */
const Stat = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="text-2xl font-bold text-red-700">{value}</div>
    <div className="text-gray-600 text-sm">{title}</div>
  </div>
);

const faqData = [
  {
    q: "How do I earn points?",
    a: "You earn 1 point for every Rp10,000 spent.",
  },
  {
    q: "How do I redeem rewards?",
    a: "Redeem via app or tell your barista.",
  },
  {
    q: "Do points expire?",
    a: "Points expire after 6 months of inactivity.",
  },
];

