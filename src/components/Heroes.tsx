export default function Heroes() {
    return (
        <section className="relative h-screen w-full bg-slate-300 overflow-hidden">
            {/* Background Map Placeholder (Ganti dengan class bg-[url('...')] sesukamu) */}
            <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Kotak Kuning Melengkung di Kiri */}
            <div className="absolute top-0 left-0 h-[85vh] w-full md:w-[50%] bg-[#FBD715] rounded-br-[120px] shadow-xl z-10 flex flex-col justify-center px-12 md:px-24">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-16 mt-20">
                    your one stop <br />
                    road solutions
                </h1>

                <ul className="space-y-10">
                    <li className="flex items-center gap-6">
                        <div className="w-4 h-12 bg-slate-800 rounded-full relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-lg text-slate-800">
                            Integration with <br /><span className="font-bold">Land Developers.</span>
                        </p>
                    </li>
                    <li className="flex items-center gap-6">
                        <div className="w-4 h-12 bg-slate-800 rounded-full relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-lg text-slate-800">
                            Fully <span className="font-bold">public</span> & <br />
                            Fully <span className="font-bold">reliable.</span>
                        </p>
                    </li>
                    <li className="flex items-center gap-6">
                        <div className="w-4 h-12 bg-slate-800 rounded-full relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-lg text-slate-800">
                            Saves you <br /><span className="font-bold">from hassle.</span>
                        </p>
                    </li>
                </ul>
            </div>
        </section>
    );
}