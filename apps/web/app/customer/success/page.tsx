import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function CustomerSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-6 items-center">
            <div className="text-4xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">Appointment Booked!</h1>
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