export function Navbar(): string {
    return`
    <nav class=" bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="text-xl font-bold track-wider"> FinanceApp</div>
    <ul class="flex space-x-4">
        <li><a href="#" class="hover:text-blue-400 transistion">Dashboard</a></li>
        <li><a href="#" class="hover:text-blue-400 transistion">Transaksi</a></li>
    </ul>
</nav>
`};