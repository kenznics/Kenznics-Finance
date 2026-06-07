export function Navbar() {
    return (
        <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <span className="text-xl font-black tracking-wider text-blue-400">Kenznics Finance</span>
            <div className="flex items-center gap-4 text-sm font-semibold text-gray-300">
                <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
                <span className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer">Logout</span>
            </div>
        </nav>
    );
}