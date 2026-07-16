export default function ReportCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
            {/* Image Skeleton */}
            <div className="w-full h-48 bg-slate-200 animate-pulse"></div>
            <div className="p-5 flex flex-col grow">
                <div className="flex justify-between items-start mb-3">
                    {/* Status Badge Skeleton */}
                    <div className="h-6 w-20 bg-slate-200 rounded-md animate-pulse"></div>
                    {/* Urgency Badge Skeleton */}
                    <div className="h-6 w-16 bg-slate-200 rounded-md animate-pulse"></div>
                </div>
                {/* Title Skeleton */}
                <div className="h-5 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse mb-4"></div>
                {/* Location Skeleton */}
                <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse mb-4"></div>
                {/* AI Analysis Skeleton */}
                <div className="bg-slate-100 p-3 rounded-lg mt-auto">
                    <div className="h-3 w-full bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}