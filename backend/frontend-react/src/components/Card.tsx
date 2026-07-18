// Membuat pengunci tipe data parameter menggunakan interface TS
interface CardProps {
  title: string;
  amount: string;
  bgColor: string;
}

// Membuat fungsi komponennya 
export function Card({ title, amount, bgColor }: CardProps) {
    return (
        <div className={`${bgColor} p-6 rounded-xl border shadow-md flex flex-col items-start gap-1 w-full max-w-sm`}>
            {/* Memanggil data props langsung kedalam HTML menggunakan kurung kurawal {} */}
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
            <span className="text-2xl font-extrabold text-gray-900">{amount}</span>
        </div>
    );
}