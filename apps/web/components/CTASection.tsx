import Button from './Button';

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Ready to reclaim your time?
          </h2>
          <p className="text-xl text-gray-500 mb-10">
            Join hundreds of music professionals who've streamlined their business with Sonata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              as="a" 
              href="#pricing" 
              variant="primary"
              className="px-10 py-4 text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition"
            >
              Start Free Trial
            </Button>
            <Button 
              as="a" 
              href="/demo" 
              variant="secondary"
              className="px-10 py-4 text-lg font-semibold rounded-full border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 shadow-md hover:shadow-lg transition"
            >
              View Live Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 