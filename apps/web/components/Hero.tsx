import Button from './Button';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
            Tune more pianos—spend{' '}
            <span className="text-blue-600">70% less time</span> on admin.
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
            The all-in-one scheduler and client manager for piano technicians and music teachers.
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
              href="/customer/book" 
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