import Link from 'next/link';

const TOPIC_PILLS = [
  'Nearby Deeds',
  'Volunteering',
  'Helping Neighbors',
  'Gratitude',
  'Giving Back',
  'Faith & Hope',
  'Random Kindness',
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-deedsie-navy">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/50">
        <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
          Deedsie
        </Link>
        <div className="flex gap-4">
          <Link
            href="/join"
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
          >
            Join now
          </Link>
          <Link
            href="/signin"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition font-medium"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-16">
        {/* Left: Headline + Sign-in */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            See the kindness happening around you.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
            Join your town. Share a Deed. Make the world brighter.
          </p>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13 1.86 1.15 4.76.67 6.34-.38 1.44-1.18 2.38-2.25 2.52-3.67.21-1.46-.24-2.35-1.05-3.27zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>
            <Link
              href="/signin"
              className="block w-full text-center px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition"
            >
              Sign in with email
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-500">
            By clicking Continue to join or sign in, you agree to Deedsie&apos;s{' '}
            <Link href="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </Link>
            ,{' '}
            <Link href="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>
            , and{' '}
            <Link href="/cookies" className="text-blue-400 hover:underline">
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        {/* Right: Illustration placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Community warmth</p>
                <p className="text-slate-500 text-xs mt-1">
                  Illustration coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Discovery Section */}
      <section className="border-t border-slate-200 dark:border-slate-700/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Explore kindness in your community
          </h2>
          <div className="flex flex-wrap gap-3">
            {TOPIC_PILLS.map((topic) => (
              <button
                key={topic}
                className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 transition text-sm font-medium"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-slate-200 dark:border-slate-700/50 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            <span className="text-blue-400 font-semibold">12,482</span> Deeds
            shared this week across{' '}
            <span className="text-blue-400 font-semibold">143</span> towns.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 dark:border-slate-700/50 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Kindness starts with one small Deed.
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Join Deedsie today.</p>
          <Link
            href="/join"
            className="inline-block px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <Link href="/about" className="hover:text-slate-400">
            About
          </Link>
          <Link href="/help" className="hover:text-slate-400">
            Help Center
          </Link>
          <Link href="/terms" className="hover:text-slate-400">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-slate-400">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
