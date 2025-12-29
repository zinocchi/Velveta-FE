import { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import "animate.css";
import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  useEffect(() => {
    ScrollReveal().reveal(".reveal", {
      origin: "bottom",
      distance: "30px",
      duration: 1000,
      interval: 120,
      opacity: 0,
      scale: 0.95,
      easing: "cubic-bezier(0.5, 0, 0, 0.1)",
      mobile: true,
    });
  }, []);

  return (
    <MainLayout>
      {/* HERO */}
      <section className="mt-20 md:mt-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden">
          <div className="bg-red-700 text-white p-10 md:p-20 text-center flex flex-col justify-center reveal">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              The Spring Edit
            </h1>
            <p className="text-lg md:text-2xl mb-6">
              Fresh flavors, familiar joy.
            </p>
            <button className="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-red-700 transition">
              View the menu
            </button>
          </div>

          <div
            className="h-64 md:h-auto bg-cover bg-center reveal"
            style={{
              backgroundImage:
                "url(https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-97315.jpg)",
            }}
          />
        </div>
      </section>

      {/* PROMO */}
      <section className="my-20 max-w-7xl mx-auto px-4 reveal">
        <div className="grid md:grid-cols-2 rounded-xl overflow-hidden shadow-lg">
          <div
            className="h-64 md:h-auto bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://i.pinimg.com/736x/fe/dd/69/fedd693b88559124917599d42495b61e.jpg)",
            }}
          />
          <div className="bg-amber-800 text-white p-10 text-center flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">
              It's a great day for free coffee
            </h2>
            <p className="mb-6">
              Start your Velveta Rewards journey today.
            </p>
            <button className="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-amber-800 transition">
              Join now
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="my-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 reveal">
          Our Signature Blends
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Velveta Black", "Caramel Cloud", "Spring Bloom"].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-lg hover:-translate-y-2 transition reveal"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5)",
                }}
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{item}</h3>
                <p className="text-gray-600 mb-4">
                  Premium coffee experience crafted just for you.
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
};

export default Home;
