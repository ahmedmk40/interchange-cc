export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-6">Interchange CC</h1>
        <p className="text-center text-lg mb-4">
          Welcome to your Next.js application with Neon database integration!
        </p>
        <div className="text-center">
          <p className="mb-2">This template includes:</p>
          <ul className="list-disc inline-block text-left">
            <li>Next.js 14 with App Router</li>
            <li>TypeScript configuration</li>
            <li>Tailwind CSS styling</li>
            <li>Shadcn UI & Radix UI components</li>
            <li>Neon PostgreSQL database</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
