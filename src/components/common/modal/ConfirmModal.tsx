type Props = {
    open: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
                                         open,
                                         message,
                                         onConfirm,
                                         onCancel,
                                     }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-[300px]">
                <p className="text-sm mb-4">{message}</p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 text-xs bg-gray-200 rounded"
                    >
                        취소
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}