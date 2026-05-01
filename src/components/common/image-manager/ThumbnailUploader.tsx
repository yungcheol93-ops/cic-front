export default function ThumbnailUploader({
                                              setThumbnail,
                                              isEdit,
                                          }: any) {

    return (
        <div className="relative bg-gray-100 overflow-hidden">

            {isEdit && (
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer">
                    변경
                    <input
                        type="file"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setThumbnail({
                                file,
                                preview: URL.createObjectURL(file),
                            });
                        }}
                    />
                </label>
            )}
        </div>
    );
}