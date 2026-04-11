"use client";

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    const getToastStyles = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-600 border-green-700 text-white';
            case 'error': return 'bg-red-600 border-red-700 text-white';
            case 'warning': return 'bg-yellow-500 border-yellow-600 text-white';
            default: return 'bg-blue-600 border-blue-700 text-white';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${getToastStyles(toast.type)} pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-right-full duration-300 min-w-[300px] transform transition-all hover:scale-105`}
                >
                    <span className="text-xl">{getIcon(toast.type)}</span>
                    <p className="font-bold flex-1">{toast.message}</p>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="ml-4 hover:opacity-75 transition-opacity"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
