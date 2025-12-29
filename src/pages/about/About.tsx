import { useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <MainLayout>
      {/* HERO */}
      <section
        className="relative h-[400px] md:h-screen max-h-[600px] bg-cover bg-center mt-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-playfair">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
              Discover the passion behind every cup of Velveta Coffee
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5"
            className="rounded-xl shadow-xl fade-in"
            alt="Coffee"
          />
          <div className="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">
              About Us
            </h2>
            <p className="text-gray-700 mb-4">
              Velveta Coffee offers delightful beverages to help you relax and
              enjoy special moments.
            </p>
            <p className="text-gray-700 mb-4">
              We are committed to quality, comfort, and sustainability.
            </p>
            <p className="text-gray-700">
              Every cup is brewed using premium beans from local farmers.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair fade-in">
            Our Mission
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Quality",
                desc: "Selected beans & perfect roasting",
              },
              {
                title: "Special Moments",
                desc: "Crafted to elevate your day",
              },
              {
                title: "Eco Friendly",
                desc: "Sustainable coffee practices",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-md text-center fade-in"
              >
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair fade-in">
            Our Locations
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Jakarta", "Bandung", "Yogyakarta", "Surabaya"].map((city) => (
              <a
                key={city}
                href="https://maps.google.com"
                target="_blank"
                className="bg-white rounded-xl shadow-md overflow-hidden fade-in hover:-translate-y-1 transition"
              >
                <img
                  src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5"
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">
                    Sunset Coffee - {city}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
