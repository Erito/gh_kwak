import { MapPin, Edit3, CheckCircle2 } from "lucide-react";

export default function Information() {
    return (
        <section className="bg-[#3D4043] py-32 relative text-white text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-16">
                Found a <br /> Roadblock? <span className="ml-12 text-slate-400 inline-block rotate-12">⚡</span> Report!
            </h2>

            {/* Area Hijau Melengkung */}
            <div className="bg-[#469A72] rounded-[60px] md:rounded-[100px] max-w-6xl mx-auto py-16 px-8 relative shadow-2xl">
                <p className="text-lg font-medium mb-12">... in 3 simple steps</p>

                {/* Garis Putus-putus Background */}
                <div className="absolute top-[55%] left-0 w-full border-t-2 border-dashed border-[#317353] z-0"></div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative z-10">
                    {/* Card 1 */}
                    <div className="bg-white text-slate-800 p-6 rounded-2xl w-56 flex items-center justify-between shadow-lg transform -rotate-2">
                        <span className="font-bold text-sm w-1/2 text-left leading-tight">ENTER<br/>LOCATION</span>
                        <MapPin className="w-8 h-8" />
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white text-slate-800 p-6 rounded-2xl w-56 flex items-center justify-between shadow-lg">
                        <span className="font-bold text-sm w-1/2 text-left leading-tight">INPUT<br/>DATA</span>
                        <Edit3 className="w-8 h-8" />
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white text-slate-800 p-6 rounded-2xl w-56 flex items-center justify-between shadow-lg transform rotate-2">
                        <span className="font-bold text-sm w-1/2 text-left leading-tight">SUBMIT!</span>
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                </div>

                <p className="mt-12 text-lg font-medium">it cannot get any easier!</p>
            </div>

            <h3 className="text-3xl font-bold mt-20">Your contributions save..</h3>
        </section>
    );
}