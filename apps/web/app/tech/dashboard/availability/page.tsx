export default function AvailabilityPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Availability</h2>
      <div className="bg-white rounded shadow p-6">
        <form className="grid grid-cols-4 gap-4">
          <label className="col-span-1">MON
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="Start" disabled />
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="End" disabled />
          </label>
          <label className="col-span-1">TUE
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="Start" disabled />
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="End" disabled />
          </label>
          <label className="col-span-1">WED
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="Start" disabled />
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="End" disabled />
          </label>
          <label className="col-span-1">THU
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="Start" disabled />
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="End" disabled />
          </label>
          <label className="col-span-1">FRI
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="Start" disabled />
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="End" disabled />
          </label>
          <label className="col-span-1">SAT
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="Start" disabled />
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="End" disabled />
          </label>
          <label className="col-span-1">SUN
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="Start" disabled />
            <input className="block border rounded px-2 py-1 mt-1 w-full" placeholder="End" disabled />
          </label>
        </form>
      </div>
    </div>
  );
} 