import { login } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form action={login} className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>
        <input name="username" placeholder="Username" required className="w-full p-2 mb-4 border rounded" />
        <input name="password" type="password" placeholder="Password" required className="w-full p-2 mb-6 border rounded" />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
