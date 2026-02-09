import { Link } from "react-router-dom";
import heroImage from "../images/about-hero.png";
import authenticityImage from "../images/authenticity.png";
import connectionImage from "../images/connection.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Whole and Rising hero - peaceful nature scene"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
            Whole and Rising
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
            From Dream to Reality Empowering authentic growth, emotional
            healing, and meaningful connection
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-10">
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            Our mission is to empower authentic growth through practical,
            heartfelt tools that support{" "}
            <span className="text-green-600 font-semibold">
              personal development
            </span>
            ,{" "}
            <span className="text-purple-600 font-semibold">
              emotional healing
            </span>
            , and{" "}
            <span className="text-teal-600 font-semibold">
              meaningful connection
            </span>
            .
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-purple-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
              <img
                src={authenticityImage}
                alt="Authenticity - living in truth"
                className="w-full h-56 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🌱</span> Authenticity
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Living and creating from a place of truth — showing up fully
                  as we are.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
              <div className="h-56 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl">
                🤍
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🕊️</span> Compassion
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  For self and others on the journey — gentle understanding in
                  every step.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-transform duration-300">
              <div className="h-56 bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center text-6xl">
                🚀
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-teal-700 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🔥</span> Empowerment
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Giving you tools to rise in your own way — unlocking your
                  inner strength.
                </p>
              </div>
            </div>

            {/* Value 4 - with real image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-transform duration-300 md:col-span-2 lg:col-span-1">
              <img
                src={connectionImage}
                alt="Connection - deeper relationships"
                className="w-full h-56 object-cover"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-pink-700 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🤝</span> Connection
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Fostering deeper relationships with self and loved ones —
                  heart-centered bonds.
                </p>
              </div>
            </div>

            {/* Value 5 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-transform duration-300 md:col-span-2 lg:col-span-1">
              <div className="h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-6xl">
                🌿
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-amber-700 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🌱</span> Growth
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Embracing continuous evolution with grace — trusting the
                  unfolding journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            Explore tools designed to support your growth, healing, and
            connection.
          </p>
          <Link
            to="/digital-products"
            className="inline-block bg-white text-green-700 hover:bg-gray-100 font-bold text-lg py-5 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore Our Digital Products →
          </Link>
        </div>
      </section>

      {/* Footer accent */}
      <div className="h-24 bg-gradient-to-t from-green-900 to-transparent"></div>
    </div>
  );
};

export default About;
