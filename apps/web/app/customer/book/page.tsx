'use client';

import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useState } from 'react';
import Logo from '@/components/Logo';
import { toast } from 'react-hot-toast';

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-6 items-center">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome to Sonata</h2>
            <p className="text-base text-gray-500 text-center">Book your piano service with ease</p>
            <Logo width={120} />
            <div className="w-full space-y-4">
              <Input 
                placeholder="Enter your zipcode" 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50" 
                disabled 
              />
              <div className="text-gray-500 text-sm text-center">
                Custom message from your technician will appear here.
              </div>
            </div>
            <Button 
              className="w-full mt-4 px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              onClick={onNext}
            >
              Get Started
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StepInstrument({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Tell us about your instrument</h2>
              <p className="text-base text-gray-500 text-center">Help us provide the best service for your piano</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Piano Type</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base">
                  <option>Grand</option>
                  <option>Upright</option>
                  <option>Console</option>
                  <option>Spinet</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model (optional)</label>
                  <Input 
                    placeholder="Model" 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make (optional)</label>
                  <Input 
                    placeholder="Make" 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year (optional)</label>
                <Input 
                  placeholder="Year" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-gray-50" 
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tuning Packages</h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500" disabled />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">Express Tuning</div>
                    <div className="text-sm text-gray-500">Quick and efficient tuning service</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">$95</div>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500" disabled />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">Standard Tuning</div>
                    <div className="text-sm text-gray-500">Comprehensive tuning with basic maintenance</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">$110</div>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" className="h-4 w-4 text-blue-600 focus:ring-blue-500" disabled />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">Precision Performance</div>
                    <div className="text-sm text-gray-500">Complete tuning and regulation service</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">$145</div>
                </label>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-4">
              <span>Duration Estimate: 1.5 hours</span>
              <span>Total Cost: $110</span>
            </div>
            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 px-4 py-2 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                variant="secondary"
                onClick={onBack}
              >
                Back
              </Button>
              <Button 
                className="flex-1 px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                onClick={onNext}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StepDateTime({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Choose a date and time</h2>
              <p className="text-base text-gray-500 text-center">Select when you'd like us to visit</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="aspect-square flex items-center justify-center">
                <div className="text-gray-500">[Calendar Placeholder]</div>
              </div>
              <Button 
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                disabled
              >
                Choose a time of arrival
              </Button>
            </div>

            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                variant="secondary"
                onClick={onBack}
              >
                Back
              </Button>
              <Button 
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                onClick={onNext}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StepContact({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Your Contact Info</h2>
              <p className="text-base text-gray-500 text-center">We'll use this to confirm your appointment</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <Input 
                    placeholder="First name" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <Input 
                    placeholder="Last name" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input 
                  placeholder="Phone" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input 
                  placeholder="Email" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <Input 
                  placeholder="Any special instructions or requests" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                variant="secondary"
                onClick={onBack}
              >
                Back
              </Button>
              <Button 
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                onClick={onNext}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StepConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-6 items-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">Appointment Booked!</h2>
            <p className="text-base text-gray-500 text-center">Thank you for choosing our service</p>
            
            <div className="w-full space-y-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">For any questions or updates, contact us at:</div>
                <div className="mt-2 font-mono text-gray-900">(xxx) xxx-xxxx</div>
                <div className="mt-1 font-mono text-gray-900">xxxxxxx@email.com</div>
              </div>
            </div>

            <Button 
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              as="a" 
              href="/"
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

const steps = [
  StepWelcome,
  StepInstrument,
  StepDateTime,
  StepContact,
  StepConfirmation,
];

export default function CustomerBookPage() {
  const [step, setStep] = useState(0);
  const StepComponent = steps[step] ?? (() => null);
  return <StepComponent onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />;
} 