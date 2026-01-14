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
        className="relative h-[calc(96vh-5rem)] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 fade-in">
              Our Story
            </h1>
            <p className="text-lg md:text-2xl text-white max-w-2xl mx-auto fade-in">
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
              Velveta Coffee, also known as Sunset Coffee, offers delightful
              coffee and beverages to help you relax under the beautiful sunset.
            </p>
            <p className="text-gray-600 mb-4">
              We are committed to providing you with a moment of respite from
              the hustle and bustle of daily life.
            </p>
            <p className="text-gray-600">
              Every cup of our coffee is brewed with love and care, using
              premium coffee beans sourced from local farmers.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 fade-in">
            Our Mission
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Quality",
                desc: "We only use selected coffee beans with perfect roasting process",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ),
              },
              {
                title: "Special Moments",
                desc: "Every cup is crafted to create special moments in your day",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "Eco-Friendly",
                desc: "We are committed to sustainable and environmentally friendly business practices",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow fade-in text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Signature Products
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our signature products that make Velveta Coffee special
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                title: "Ballerinna Cappuccino",
                desc: "Authentic Italian cappuccino with our barista's sweet touch. Made with high-quality espresso and perfectly steamed milk.",
                tag: "Best Seller",
                tagColor: "bg-red-100 text-red-800",
                stars: "★ ★ ★ ★ ★",
              },
              {
                img: "https://globalassets.starbucks.com/digitalassets/products/bev/IcedMatchaTeaLatte.jpg?impolicy=1by1_wide_topcrop_630",
                title: "Our Matcha",
                desc: "Delicious matcha for green tea lovers. Made from ceremonial grade matcha powder from Japan, perfectly whisked.",
                tag: "Healthy",
                tagColor: "bg-green-100 text-green-800",
                stars: "",
              },
              {
                img: "https://globalassets.starbucks.com/digitalassets/products/bev/IcedShakenEspresso.jpg?impolicy=1by1_wide_topcrop_630",
                title: "Americanno",
                desc: "For true black coffee connoisseurs. Strong espresso diluted with hot water, delivering authentic coffee flavor.",
                tag: "Strong",
                tagColor: "bg-blue-100 text-blue-800",
                stars: "",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow fade-in text-center"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="flex justify-center items-center space-x-2">
                  <span
                    className={`${item.tagColor} text-sm font-medium px-2.5 py-0.5 rounded`}
                  >
                    {item.tag}
                  </span>
                  {item.stars && (
                    <span className="text-gray-500">{item.stars}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 fade-in">
            Our Locations
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                title: "Sunset Coffee - South Jakarta",
                address: "📍 Jl. Sudirman Kav. 52-53",
              },
              {
                img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                title: "Sunset Coffee - Bandung",
                address: "📍 Jl. Riau No. 23",
              },
              {
                img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                title: "Sunset Coffee - Yogyakarta",
                address: "📍 Jl. Malioboro No. 123",
              },
              {
                img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                title: "Sunset Coffee - Surabaya",
                address: "📍 Jl. Tunjungan No. 45",
              },
            ].map((item, i) => (
              <a
                key={i}
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow overflow-hidden fade-in block"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.address}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
