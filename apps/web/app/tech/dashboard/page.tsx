import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Card from "@/components/Card";

export default async function TechDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/tech/login");
  }

  return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-base text-gray-500">Here's your overview for today</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Today's Appointments</div>
                  <div className="mt-2 text-3xl font-bold text-blue-600">3</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-900">Completed This Week</div>
                  <div className="mt-2 text-3xl font-bold text-green-600">12</div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">Upcoming Appointments</div>
                  <div className="mt-2 text-3xl font-bold text-purple-600">8</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-base text-gray-500">Common tasks and shortcuts</p>
              </div>
              
              <div className="space-y-4">
                <button className="w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-sm font-medium text-gray-900">View Today's Schedule</div>
                  <div className="text-sm text-gray-500">Check your appointments for today</div>
                </button>
                
                <button className="w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-sm font-medium text-gray-900">Add New Customer</div>
                  <div className="text-sm text-gray-500">Register a new customer</div>
                </button>
                
                <button className="w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-sm font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-500">Check your performance metrics</div>
                </button>
              </div>
            </div>
          </Card>
    </div>
  );
} 