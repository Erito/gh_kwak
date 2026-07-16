export default function Heroes() {
    return (
        <section className="relative h-screen w-full bg-slate-200 overflow-hidden">
            {/* Background Map dari Folder Public */}
            <div className="absolute inset-0 bg-[url('/assets/heroes/bgMap.svg')] bg-cover bg-center bg-no-repeat opacity-80"></div>

            {/* Kotak Kuning Melengkung di Kiri */}
            <div className="absolute top-0 left-0 h-[85vh] w-full md:w-[50%] bg-[#FBD715] rounded-br-[120px] shadow-2xl z-10 flex flex-col justify-center px-10 md:px-20">
                
                {/* Logo & Judul */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-16 mt-16">
                    {/* Logo putih di dalam kotak kuning */}
                    <img src="/assets/logo/logo-only-white.svg" alt="Logo White" className="h-20 md:h-24 shrink-0" />
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight">
                        your one stop <br />
                        road solutions
                    </h1>
                </div>

                {/* List Poin */}
                <ul className="space-y-8">
                    <li className="flex items-center gap-6">
                        <div className="w-4 h-12 bg-slate-800 rounded-full relative shrink-0">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-lg text-slate-800 leading-snug">
                            Integration with <br /><span className="font-bold">Land Developers.</span>
                        </p>
                    </li>
                    <li className="flex items-center gap-6">
                        <div className="w-4 h-12 bg-slate-800 rounded-full relative shrink-0">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-lg text-slate-800 leading-snug">
                            Fully <span className="font-bold">public</span> & <br />
                            Fully <span className="font-bold">reliable.</span>
                        </p>
                    </li>
                    <li className="flex items-center gap-6">
                        <div className="w-4 h-12 bg-slate-800 rounded-full relative shrink-0">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-lg text-slate-800 leading-snug">
                            Saves you <br /><span className="font-bold">from hassle.</span>
                        </p>
                    </li>
                </ul>
            </div>
        </section>
    );
}