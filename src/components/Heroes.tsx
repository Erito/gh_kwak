import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Heroes() {
    return (
        <section className="relative h-screen w-full bg-slate-200 overflow-hidden">
            {/* Background Map */}
            <div className="absolute inset-0 bg-[url('/assets/heroes/bgMap.svg')] bg-cover bg-center bg-no-repeat opacity-80"></div>

            {/* Kotak Kuning */}
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 left-0 h-[85vh] w-full md:w-[55%] lg:w-[50%] bg-[#FBD715] rounded-br-[80px] md:rounded-br-[120px] shadow-2xl z-10 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20"
            >
                {/* Logo & Judul */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-10 md:mb-16 mt-20 md:mt-16">
                    <img src="/assets/logo/logo-only-white.svg" alt="Logo White" className="h-14 sm:h-16 md:h-20 lg:h-24 shrink-0" />
                    <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                        your one stop <br />
                        road solutions
                    </h1>
                </div>

                {/* List Poin */}
                <ul className="space-y-5 md:space-y-8">
                    <li className="flex items-center gap-4 md:gap-6">
                        <div className="w-3 md:w-4 h-10 md:h-12 bg-slate-800 rounded-full relative shrink-0">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-base md:text-lg text-slate-800 leading-snug">
                            Integration with <br /><span className="font-bold">Land Developers.</span>
                        </p>
                    </li>
                    <li className="flex items-center gap-4 md:gap-6">
                        <div className="w-3 md:w-4 h-10 md:h-12 bg-slate-800 rounded-full relative shrink-0">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-base md:text-lg text-slate-800 leading-snug">
                            Fully <span className="font-bold">public</span> & <br />
                            Fully <span className="font-bold">reliable.</span>
                        </p>
                    </li>
                    <li className="flex items-center gap-4 md:gap-6">
                        <div className="w-3 md:w-4 h-10 md:h-12 bg-slate-800 rounded-full relative shrink-0">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 -translate-y-1/2"></div>
                        </div>
                        <p className="text-base md:text-lg text-slate-800 leading-snug">
                            Saves you <br /><span className="font-bold">from hassle.</span>
                        </p>
                    </li>
                </ul>

                {/* Mobile CTA Button */}
                <div className="mt-8 md:hidden">
                    <Link
                        to="/report"
                        className="inline-flex items-center gap-2 bg-slate-800 text-white font-bold px-6 py-3 rounded-full text-sm shadow-lg"
                    >
                        Mulai Lapor Sekarang →
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}