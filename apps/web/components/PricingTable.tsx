'use client';

import { useState } from 'react';
import Card from './Card';
import Button from './Button';

const tiers = [
  {
    name: 'Solo',
    price: { monthly: 14, annual: 140 },
    blurb: '1 provider • ≤400 clients',
    cta: 'Start Solo',
    features: ['Unlimited appointments', 'Email reminders', 'Basic reporting', 'Mobile app']
  },
  {
    name: 'Pro',
    price: { monthly: 29, annual: 290 },
    blurb: 'Up to 3 providers + SMS + lesson packages',
    cta: 'Start Pro',
    featured: true,
    features: ['Everything in Solo', 'SMS reminders', 'Lesson packages', 'Advanced analytics', 'API access']
  },
  {
    name: 'Studio',
    price: { monthly: 59, annual: 590 },
    blurb: '4-10 providers • group classes • payroll export',
    cta: 'Start Studio',
    features: ['Everything in Pro', 'Group classes', 'Payroll export', 'White-label options', 'Priority support']
  }
];

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
              Annual
              <span className="ml-1 text-xs text-green-600 font-normal">(Save 17%)</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {tiers.map((tier, index) => (
            <div key={index} className="relative">
              <Card
                className={`rounded-3xl p-10 transition-all duration-300 ${
                  tier.featured
                    ? 'bg-gradient-to-br from-blue-100 via-white to-blue-200 border-blue-200 scale-105 z-10 shadow-2xl'
                    : 'bg-white border-gray-100 shadow-xl'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-5 py-1 rounded-full text-base font-semibold shadow">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-500 mb-6 text-lg">{tier.blurb}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ${isAnnual ? tier.price.annual : tier.price.monthly}
                    </span>
                    <span className="text-gray-400 ml-2 text-lg">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  <Button
                    as="a"
                    href="/tech/sign-up"
                    variant={tier.featured ? 'primary' : 'secondary'}
                    className={`w-full mb-0 py-3 text-lg font-semibold rounded-full ${tier.featured ? 'shadow-md hover:shadow-lg' : ''}`}
                  >
                    {tier.cta}
                  </Button>
                  <ul className="text-left space-y-3 mt-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 