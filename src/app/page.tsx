"use client";

import Link from "next/link";
import { Dumbbell, HeartPulse, ChartBar, Timer } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="w-full flex justify-center py-6">
        <nav className="w-[95%] md:w-[90%] lg:w-[85%] 
        bg-black text-white rounded-full px-6 py-4 flex items-center justify-between shadow-xl">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-wider">
              FITNESS<span className="text-gray-400">PRO</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-gray-300">
            <Link href="/login" className="hover:text-white">Se connecter</Link>
            <Link href="/" className="hover:text-white">Commencer</Link>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="container mx-auto px-6 md:px-15 py-10">
        <h1 className=" md:text-7xl font-black text-4xl text-black leading-tight">
          Boost Your Performance 
          <br />
          <span className="italic text-gray-800">with FITNESS PRO</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-2xl">
         Train smart, stay strong, reach your goals.
        </p>

        

        {/* CTA */}
        <div className="mt-10 flex items-center gap-4 flex-wrap">
          <Link
            href="/register_coach"
            className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-900 transition"
          >
            Vous êtes coach ?
          </Link>

          <Link
            href="/register"
            className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium border border-gray-300 hover:bg-gray-100 transition"
          >
            Vous êtes membre ?
          </Link>
        </div>

      </section>
      {/* FEATURES */}
      <section className="container mx-auto my-2 px-6 md:px-10 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          <FeatureCard
            icon={<Dumbbell className="w-8 h-8" />}
            title="Programmes Personnalisés"
            description="Des plans d'entraînement adaptés à tes objectifs et ton niveau."
          />

          <FeatureCard
            icon={<HeartPulse className="w-8 h-8" />}
            title="Suivi Santé"
            description="Analyse de la progression, calories et rythme cardiaque."
          />

          <FeatureCard
            icon={<ChartBar className="w-8 h-8" />}
            title="Statistiques Avancées"
            description="Visualise tes performances pour progresser plus vite."
          />

          <FeatureCard
            icon={<Timer className="w-8 h-8" />}
            title="Coaching en Temps Réel"
            description="Recevez des conseils instantanés pendant vos exercices."
          />

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t">
        © 2024 FITNESS PRO — Tous droits réservés.
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
      <div className="w-14 h-14 bg-black/5 rounded-lg flex items-center justify-center text-black mb-4">
        {icon}
      </div>
      <h3 className="text-xl text-black font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
