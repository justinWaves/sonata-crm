'use client';

import Card from './Card';

const features = [
  {
    title: 'Smart Scheduling',
    description: 'Drag-and-drop calendar built for service windows *and* recurring lessons.',
    icon: '📅'
  },
  {
    title: 'Automated Reminders',
    description: 'Email & SMS nudges cut no-shows to near zero.',
    icon: '🔔'
  },
  {
    title: 'Instrument History',
    description: 'Every piano, guitar, or violin—service dates at a glance.',
    icon: '🎹'
  },
  {
    title: 'Simple Invoicing',
    description: 'Stripe-powered payments, no chasing checks.',
    icon: '💳'
  }
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Everything you need to run your business
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            From scheduling to invoicing, we've got you covered with tools designed specifically for music professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-2xl transition-shadow duration-300 rounded-2xl p-10">
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 