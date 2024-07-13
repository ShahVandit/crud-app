import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Website</h1>
        <div className="space-x-4">
            <a href="/signup" className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Sign Up</a>
            <a href="/login" className="inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300">Sign In</a>
        </div>
    </div>
    </main>
  );
}
