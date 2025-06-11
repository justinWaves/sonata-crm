export default function AccountPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Account</h2>
      <div className="bg-white rounded shadow p-6 max-w-md">
        <form className="space-y-4">
          <div className="flex gap-2">
            <input className="input w-full" placeholder="First Name" disabled />
            <input className="input w-full" placeholder="Last Name" disabled />
          </div>
          <input className="input w-full" placeholder="Email" disabled />
          <input className="input w-full" placeholder="Work Phone" disabled />
          <input className="input w-full" placeholder="Change Password" type="password" disabled />
          <button className="btn w-full" disabled>Save</button>
        </form>
      </div>
    </div>
  );
} 