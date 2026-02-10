import React, { useRef } from "react";
import { motion } from "framer-motion";

import heroBg from "../assets/images/hero-wellness-bg.png";
import heroVideo from "../assets/images/MindVideo_20260209154554_102.mp4";
import growthImg from "../assets/images/growth-flatlay.png";
import avatarSarah from "../assets/images/avatar-sarah.png";
import avatarJames from "../assets/images/avatar-james.png";
import avatarAisha from "../assets/images/avatar-aisha.png";

const Home = () => {
  const videoRef = useRef(null);

  // Optional: gentle entrance for the video container (very subtle)
  const videoContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfaf5] to-[#f5f5f4]">
      {/* Hero Section – Seamless looping video only */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          variants={videoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <video
            ref={videoRef}
            src={heroVideo}
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/35 z-10" />

        {/* Hero content */}
        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
            Welcome to Whole and Rising
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-light drop-shadow-md">
            Digital tools and gentle guidance for personal growth, authentic
            connection, family wellness, and intentional living.
          </p>
          <a
            href="/digital-products"
            className="
              mt-10 inline-block
              bg-emerald-400 hover:bg-emerald-500
              text-white font-semibold
              py-4 px-12 rounded-full
              shadow-xl hover:shadow-2xl
              transition-all duration-300 transform hover:-translate-y-1
              text-lg md:text-xl
            "
          >
            Start Your Journey
          </a>
        </div>
      </section>

      {/* What You'll Gain */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-emerald-800 mb-12">
            What You’ll Gain
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <ul className="space-y-6 text-lg md:text-xl text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 text-2xl mr-4">✓</span>
                  Build unshakable confidence and authentic self-expression
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-2xl mr-4">✓</span>
                  Create healthy, joyful habits for the whole family
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-2xl mr-4">✓</span>
                  Make intentional choices that align with your values
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-2xl mr-4">✓</span>
                  Release limiting beliefs and emotional blocks
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-2xl mr-4">✓</span>
                  Live a life rooted in connection, clarity, and purpose
                </li>
              </ul>
            </div>

            <div className="hidden md:block">
              <img
                src={growthImg}
                alt="Wellness flatlay - journal, nature elements, calm aesthetic"
                className="rounded-2xl shadow-2xl object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-teal-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-emerald-800 mb-16">
            What People Are Saying
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
              <div className="flex items-center mb-6">
                <img
                  src={avatarSarah}
                  alt="Sarah M."
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-emerald-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-500">
                    Working Mom & Growth Enthusiast
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "These gentle tools helped me reclaim my energy and create
                sacred family moments again."
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
              <div className="flex items-center mb-6">
                <img
                  src={avatarJames}
                  alt="James K."
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-emerald-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">James K.</p>
                  <p className="text-sm text-gray-500">
                    Career Transition Coach
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "A real digital sanctuary — helped me unpack old beliefs and
                realign with purpose."
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
              <div className="flex items-center mb-6">
                <img
                  src={avatarAisha}
                  alt="Kim R."
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-emerald-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">Kim R.</p>
                  <p className="text-sm text-gray-500">
                    Wellness Advocate & Yoga Instructor
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "Deepened my home practice and brought emotional connection back
                to center."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-emerald-800 text-white px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Begin Your Becoming?
        </h2>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90">
          Join others who are choosing intention, growth, and wholeness one
          small, powerful step at a time.
        </p>
        <a
          href="/digital-products"
          className="
            inline-block bg-white text-emerald-800 font-bold
            py-5 px-14 rounded-full text-xl
            hover:bg-emerald-50 transition-colors shadow-xl
          "
        >
          Browse All Products
        </a>
      </section>
    </div>
  );
};

export default Home;
