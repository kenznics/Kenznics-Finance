// struktur interface untuk tipe data Props yang masuk ke card
interface cardProps {
    title: string;
    amount: string;
    bgColor: string;
}

export default function Card ({ title, amount, bgColor }: cardProps) {
    return (
        <div className={`p-6 rounded-2xl border border-slate-200/80 shadow-sm w-full flex flex-col gap-2 ${bgColor}`}>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {title}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {amount}
            </h2>
        </div>
    );
}