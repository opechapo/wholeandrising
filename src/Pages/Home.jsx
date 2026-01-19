const Home = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-20 bg-gray-50 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Welcome to Whole and Rising
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering you with tools for personal growth, authentic connection,
          and holistic wellness.
        </p>
        <a
          href="/digital-products"
          className="
            mt-10 inline-block
            bg-green-600 hover:bg-green-700
            text-white font-medium
            py-4 px-10 rounded-lg
            shadow-md hover:shadow-lg
            transition-all duration-300
            text-lg
          "
        >
          Browse Digital Products
        </a>
      </section>

      {/* What You'll Gain */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          What You’ll Gain
        </h2>
        <ul className="list-disc list-inside mx-auto max-w-3xl text-lg text-gray-700 space-y-4">
          <li>Build deeper confidence and self-trust</li>
          <li>Improve communication and relationships</li>
          <li>Release limiting beliefs and emotional blocks</li>
          <li>Develop tools for authentic living and growth</li>
          <li>Feel more aligned, empowered, and whole</li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white rounded-2xl shadow-sm">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          What People Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-12">
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-700 italic mb-6">
              "These tools completely transformed how I connect with myself and
              others."
            </p>
            <p className="font-medium text-gray-900">— Sarah M.</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-700 italic mb-6">
              "Finally, practical resources that actually work for real-life
              healing."
            </p>
            <p className="font-medium text-gray-900">— James K.</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-700 italic mb-6">
              "I feel more grounded and alive than I have in years. Thank you!"
            </p>
            <p className="font-medium text-gray-900">— Aisha R.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
