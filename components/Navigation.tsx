import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          LPS Hub
        </Link>
        <div className="space-x-4 text-lg">
          <Link href="/">Home</Link>
          <Link href="/admin/classes">Classes</Link>
        </div>
      </div>
    </nav>
  );
}
