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

        {/* Dark overlay */}
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

      {/* What You'll Gain – more horizontal padding */}
      <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-emerald-800 mb-16 md:mb-20 tracking-tight">
            What You’ll Gain
          </h2>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <ul className="space-y-8 md:space-y-10 text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                <li className="flex items-start">
                  <span className="text-emerald-600 text-3xl md:text-4xl mr-5 mt-1">
                    ✓
                  </span>
                  Build unshakable confidence and authentic self-expression
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-3xl md:text-4xl mr-5 mt-1">
                    ✓
                  </span>
                  Create healthy, joyful habits for the whole family
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-3xl md:text-4xl mr-5 mt-1">
                    ✓
                  </span>
                  Make intentional choices that align with your values
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-3xl md:text-4xl mr-5 mt-1">
                    ✓
                  </span>
                  Release limiting beliefs and emotional blocks
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 text-3xl md:text-4xl mr-5 mt-1">
                    ✓
                  </span>
                  Live a life rooted in connection, clarity, and purpose
                </li>
              </ul>
            </div>

            <div className="hidden md:block">
              <img
                src={growthImg}
                alt="Wellness flatlay - journal, nature elements, calm aesthetic"
                className="rounded-3xl shadow-2xl object-cover w-full h-auto lg:h-[580px] xl:h-[680px] transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section – more horizontal padding */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-emerald-800 mb-16 md:mb-24 tracking-tight">
            What People Are Saying
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                img: avatarSarah,
                name: "Sarah M.",
                role: "Working Mom & Growth Enthusiast",
                quote:
                  "These gentle tools helped me reclaim my energy and create sacred family moments again.",
              },
              {
                img: avatarJames,
                name: "James K.",
                role: "Career Transition Coach",
                quote:
                  "A real digital sanctuary — helped me unpack old beliefs and realign with purpose.",
              },
              {
                img: avatarAisha,
                name: "Kim R.",
                role: "Wellness Advocate & Yoga Instructor",
                quote:
                  "Deepened my home practice and brought emotional connection back to center.",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100/60 hover:border-emerald-200 group"
              >
                <div className="flex items-center mb-8">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mr-5 border-4 border-emerald-100 group-hover:border-emerald-200 transition-colors"
                  />
                  <div>
                    <p className="font-bold text-xl md:text-2xl text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-base md:text-lg text-emerald-700 font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-lg md:text-xl leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 text-center bg-emerald-800 text-white px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
          Ready to Begin Your Becoming?
        </h2>
        <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-12 opacity-90">
          Join others who are choosing intention, growth, and wholeness one
          small, powerful step at a time.
        </p>
        <a
          href="/digital-products"
          className="
            inline-block bg-white text-emerald-800 font-bold
            py-5 px-16 rounded-full text-xl md:text-2xl
            hover:bg-emerald-50 transition-all shadow-2xl hover:shadow-3xl
            transform hover:-translate-y-1 duration-300
          "
        >
          Browse All Products
        </a>
      </section>
    </div>
  );
};

export default Home;
