import Link from "next/link";
export default function Navbar() {
    return (
        <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <div className="font-bold text-xl tracking-tight text-indigo-400">
                Kenznics Finance
            </div>

            <div className="flex gap-4 text-sm font-medium">
                <Link href="/dashboard" className="hover:text-indigo-300 transition-colors">
                    Dashboard
                </Link>

                <Link href="/history" className="hover:text-indigo-300 transition-colors">
                    History
                </Link>
            </div>
        </nav>
    );
}
