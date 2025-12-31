import { useEffect } from "react";

const About = () => {
  useEffect(() => {
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
      <section
        className="relative h-[96vh] mt-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Our Story
            </h1>
            <p className="text-lg md:text-2xl text-white max-w-2xl mx-auto">
              Discover the passion behind every cup of Velveta Coffee
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5"
            className="rounded-xl shadow-lg fade-in"
            alt="About Velveta"
          />
          <div className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Velveta
            </h2>
            <p className="text-gray-600 mb-4">
              Velveta Coffee offers delightful coffee experiences to help you
              relax and enjoy your day.
            </p>
            <p className="text-gray-600">
              Every cup is brewed with premium beans sourced from local farmers.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 fade-in">
            Our Mission
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Quality",
                desc: "Selected beans with perfect roasting.",
              },
              {
                title: "Special Moments",
                desc: "Every cup creates meaningful moments.",
              },
              {
                title: "Eco Friendly",
                desc: "Sustainable & responsible business.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow fade-in text-center"
              >
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center fade-in">
            Signature Products
          </h2>

          {[
            {
              name: "Ballerina Cappuccino",
              img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5",
              desc: "Authentic cappuccino with premium espresso.",
            },
            {
              name: "Matcha Latte",
              img: "https://globalassets.starbucks.com/digitalassets/products/bev/IcedMatchaTeaLatte.jpg",
              desc: "Ceremonial grade matcha from Japan.",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-6 bg-gray-50 p-6 rounded-xl fade-in"
            >
              <img
                src={p.img}
                className="w-full md:w-1/3 h-60 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                <p className="text-gray-600">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );  
};

export default About;
