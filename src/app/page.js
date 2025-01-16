export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Welcome to Chariot</h1>
        <p className="text-xl text-gray-600 mt-2">A platform for workers, managers, and admins</p>
      </header>

      <section className="text-center">
        <h2 className="text-3xl font-medium text-gray-700">Features</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold text-gray-800">For Workers</h3>
            <p className="text-gray-600 mt-2">
              Access your tasks, track progress, and submit reports.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold text-gray-800">For Managers</h3>
            <p className="text-gray-600 mt-2">
              Manage projects, assign tasks, and monitor team performance.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold text-gray-800">For Admins</h3>
            <p className="text-gray-600 mt-2">
              Oversee system-wide settings, manage users, and handle data.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-3xl font-medium text-gray-700">Get Started</h2>
        <p className="text-xl text-gray-600 mt-4">Log in to access your dashboard based on your role.</p>
        <div className="mt-6">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </section>
    </div>
  );
}
