import ScrollReveal from "scrollreveal";
import { useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";

export default function Home() {
  useEffect(() => {
    ScrollReveal().reveal(".animate-fade-in", {
      duration: 1000,
      origin: "bottom",
      distance: "50px",
      interval: 200,
      easing: "ease-in-out",
    });
  }, []);
  
  return (
    <MainLayout>
      {/* HERO */}
      <section className="mt-20 md:mt-24 relative overflow-hidden reveal">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden">
          <div className="bg-red-700 text-white px-6 py-20 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-montserrat">
              The Spring Edit
            </h1>
            <p className="text-xl mb-8">Fresh flavors, familiar joy.</p>
            <button className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-red-700 transition">
              View the menu
            </button>
          </div>

          <div
            className="h-64 md:h-auto bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97315.jpg)",
            }}
          />
        </div>
      </section>

      {/* PROMO */}
      <section className="my-24 max-w-7xl mx-auto px-4 reveal">
        <div className="grid md:grid-cols-2 rounded-xl overflow-hidden shadow-xl">
          <div
            className="h-64 md:h-auto bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://i.pinimg.com/736x/fe/dd/69/fedd693b88559124917599d42495b61e.jpg)",
            }}
          />
          <div className="bg-amber-800 text-white px-8 py-16 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-6">
              It's a great day for free coffee
            </h2>
            <p className="mb-8 max-w-md">
              Join Velveta Rewards and enjoy a free handcrafted drink.
            </p>
            <button className="px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-amber-800 transition">
              Join now
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="my-24 max-w-7xl mx-auto px-4 reveal">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our Signature Blends
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {["Velveta Black", "Caramel Cloud", "Spring Bloom"].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-lg hover:-translate-y-2 transition"
            >
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5)",
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item}</h3>
                <p className="text-gray-600 mb-4">
                  Premium coffee crafted with passion.
                </p>
                <button className="text-red-700 font-semibold hover:underline">
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}


