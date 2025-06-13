import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function TechDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/tech/login");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-white rounded shadow p-12 min-w-[400px] text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, Technician</h1>
        <p className="text-gray-500">Select a section from the sidebar to get started.</p>
      </div>
    </div>
  );
} 