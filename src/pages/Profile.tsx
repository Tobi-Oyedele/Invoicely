const Profile = () => {
  return (
    <main className="py-10 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your personal details and business credentials.
        </p>
      </div>

      {/* Placeholder Area */}
      <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl h-96 flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
        Profile details are coming soon...
      </div>
    </main>
  );
};

export default Profile;
