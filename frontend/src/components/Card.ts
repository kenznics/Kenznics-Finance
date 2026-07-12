export function Card(title: string, amount: string, bgcolor: string): string {
    return /* HTML */`
    <div class="${bgcolor} p-6 rounded-x1 border shadow-sm flex flex-col items-start gap-1">
    <!-- Ketik tag HTML untuk Judul Card dibawah ini, panggil variable title -->
    <span classs="text-sm font-medium text-gray-700 uppercase tracking-wider">${title}</span>

    <!-- Nominal Uang: Pakai Hitam tebal dan ukuran besar -->
    <span class="text-2xl font-extrabold text-gray-900">${amount}</span>
    </div>
    `;
}