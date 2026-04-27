import React from "react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
    return (
        <section className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-xl w-full text-center border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-sm bg-white">
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
                    Sunset Daydreams
                </p>

                <h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 mb-4">
                    Coming Soon
                </h1>

                <p className="text-gray-600 text-base sm:text-lg mb-8">
                    This page is still in the works. Check back soon!
                </p>

                <Link
                    to='/'
                    className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
                >
                    Back to Home
                </Link>
            </div>
        </section>
    );
};

export default ComingSoon;
