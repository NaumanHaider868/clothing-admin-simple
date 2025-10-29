export default function ViewProductSkeleton() {
    return (
        <div className="view-product p-6 pl-0 flex gap-6">
            <div className="flex w-full justify-between">
                <div className="p-4 bg-white rounded-md w-[38%]">
                    <div className="">
                        <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg h-[420px] animate-pulse shadow-sm"></div>
                    </div>
                </div>

                <div className="p-4 bg-white rounded-md w-1/2 space-y-6">
                    <div className="">
                        <div className="flex justify-end">
                            <div className="w-[34px] h-[34px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse border border-gray-300"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-8 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-1/4 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-4/6 animate-pulse"></div>
                                <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-3/6 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-16 animate-pulse"></div>
                            <div className="flex gap-3">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="w-8 h-8 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full animate-pulse border border-gray-300"></div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-12 animate-pulse"></div>
                            <div className="flex gap-3">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="w-10 h-10 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse border border-gray-300 flex items-center justify-center">
                                        <div className="w-4 h-3"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-64 animate-pulse"></div>
                        </div>

                        <div className="h-12 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg w-32 animate-pulse mt-6 border border-gray-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}