const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
        About Whole and Rising
      </h1>

      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
          From Dream to Reality
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our mission is to empower authentic growth through practical,
          heartfelt tools that support personal development, emotional healing,
          and meaningful connection.
        </p>
      </section>

      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
          Our Core Values
        </h2>
        <ul className="space-y-4 text-lg text-gray-700 list-disc pl-6 max-w-3xl mx-auto md:mx-0">
          <li>Authenticity — living and creating from a place of truth</li>
          <li>Compassion — for self and others on the journey</li>
          <li>Empowerment — giving you tools to rise in your own way</li>
          <li>
            Connection — fostering deeper relationships with self and loved ones
          </li>
          <li>Growth — embracing continuous evolution with grace</li>
        </ul>
      </section>

      {/* Optional CTA */}
      <div className="text-center">
        <a
          href="/digital-products"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-10 rounded-lg shadow-md transition-all duration-300 text-lg"
        >
          Explore Our Digital Products
        </a>
      </div>
    </div>
  );
};

export default About;
