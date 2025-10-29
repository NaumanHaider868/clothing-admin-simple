const ErrorHandler = ({ error, message = "Something went wrong", handleReFetch }) => {
    const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load products.";

    return (
        <div className="w-full pr-[52px]">
            <div className="mt-10 p-4 bg-red-50 border border-red-200 rounded text-red-800">
                <div className="font-medium mb-2">{message}</div>
                <div className="text-sm mb-3">{errorMessage}</div>

                {/* {typeof handleReFetch === "function" && ( */}
                <div className="flex gap-2">
                    <button
                        onClick={handleReFetch}
                        className="px-3 py-1 rounded bg-black text-white hover:opacity-90"
                    >
                        Retry
                    </button>
                </div>
                {/* )} */}
            </div>
        </div>
    );
};

export default ErrorHandler;