interface Props {
    open: boolean;
    message: string;
    onClose: () => void;
}

export default function AlertModal({ open, message, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* dim */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* modal */}
            <div className="relative z-10 w-[85%] max-w-[360px] bg-white rounded-xl shadow-lg p-6 text-center">

                <p className="text-sm text-zinc-700 leading-relaxed">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-zinc-800 text-white py-2 text-sm rounded-lg"
                >
                    확인
                </button>

            </div>
        </div>
    );
}