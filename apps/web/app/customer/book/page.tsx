'use client';

import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useState } from 'react';
import Logo from '@/components/Logo';

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-12 flex flex-col gap-6 items-center">
      
      <h2 className="text-xl font-semibold text-center">Thank you for choosing</h2>
      <Logo width={200} />
      <Input placeholder="Enter your zipcode" className="w-full" disabled />
      <div className="text-gray-500 text-sm w-full text-center">Custom message from your technician will appear here.</div>
      <Button className="w-full mt-4" onClick={onNext}>Next</Button>
    </Card>
  );
}

function StepInstrument({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-12 flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-center">Tell us about your instrument</h2>
      <div className="flex flex-col gap-3">
        <select className="border rounded px-3 py-2 w-full bg-gray-100" >
          <option>Grand</option>
          <option>Upright</option>
          <option>Console</option>
          <option>Spinet</option>
          <option>Other</option>
        </select>
        <Input placeholder="Model (optional)" className="w-full" disabled />
        <Input placeholder="Make (optional)" className="w-full" disabled />
        <Input placeholder="Year (optional)" className="w-full" disabled />
      </div>
      <div className="mt-4">
        <div className="font-medium mb-2">Tuning Packages</div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2"><input type="radio" disabled /> Express Tuning <span className="ml-auto text-gray-500 text-sm">1h — $95</span></label>
          <label className="flex items-center gap-2"><input type="radio" disabled /> Standard Tuning <span className="ml-auto text-gray-500 text-sm">1.5h — $110</span></label>
          <label className="flex items-center gap-2"><input type="radio" disabled /> Precision Performance <span className="ml-auto text-gray-500 text-sm">2h — $145</span></label>
        </div>
      </div>
      <div className="flex justify-between text-gray-500 text-sm mt-2">
        <span>Duration Estimate</span>
        <span>Total Cost</span>
      </div>
      <div className="flex gap-2 mt-6">
        <Button className="w-1/2" variant="secondary" onClick={onBack}>Back</Button>
        <Button className="w-1/2" onClick={onNext}>Next</Button>
      </div>
    </Card>
  );
}

function StepDateTime({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-12 flex flex-col gap-6 items-center">
      <h2 className="text-xl font-semibold text-center">Choose a date or time</h2>
      <div className="w-full flex justify-center">
        <div className="bg-gray-100 rounded p-4 w-full flex flex-col items-center">
          <div className="mb-2 text-gray-500">[Calendar Placeholder]</div>
          <Button className="w-full" disabled>Choose a time of arrival</Button>
        </div>
      </div>
      <div className="flex gap-2 mt-6 w-full">
        <Button className="w-1/2" variant="secondary" onClick={onBack}>Back</Button>
        <Button className="w-1/2" onClick={onNext}>Next</Button>
      </div>
    </Card>
  );
}

function StepContact({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-12 flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-center">Your Contact Info</h2>
      <div className="flex flex-col gap-3">
        <Input placeholder="First name" className="w-full" disabled />
        <Input placeholder="Last name" className="w-full" disabled />
        <Input placeholder="Phone" className="w-full" disabled />
        <Input placeholder="Email" className="w-full" disabled />
        <Input placeholder="Notes (optional)" className="w-full" disabled />
      </div>
      <div className="flex gap-2 mt-6">
        <Button className="w-1/2" variant="secondary" onClick={onBack}>Back</Button>
        <Button className="w-1/2" onClick={onNext}>Book Appointment</Button>
      </div>
    </Card>
  );
}

function StepConfirmation() {
  return (
    <Card className="max-w-md mx-auto mt-12 flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-bold text-center">🎉 Appointment Booked 🎉</h2>
      <div className="text-center text-gray-600">
        <div>Call<br /><span className="font-mono">(xxx) xxx-xxxx</span></div>
        <div className="mt-2">or email<br /><span className="font-mono">xxxxxxx@email.com</span></div>
        <div className="mt-2">for any questions or updates</div>
      </div>
      <Button className="mt-4" as="a" href="/">Return to Our Page</Button>
    </Card>
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