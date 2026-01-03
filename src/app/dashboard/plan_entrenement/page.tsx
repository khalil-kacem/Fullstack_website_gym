'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

type FormData = {
  age: number;
  taille: number;
  entrainement: string;
  objectifs: string;
  poids_actuel: number;
  poids_cible: number;
};

export default function FitnessAIForm() {
  const { register, handleSubmit } = useForm<FormData>();
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = '';
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleFormSubmit = async (data: FormData) => {
    const userMessage = {
      role: 'user',
      text: `
Tu es un coach sportif expert.

Voici les données de l'utilisateur :
- Âge : ${data.age}
- Taille : ${data.taille} cm
- Poids actuel : ${data.poids_actuel} kg
- Type d'entraînement préféré : ${data.entrainement}
- Objectif : ${data.objectifs}
- Poids cible : ${data.poids_cible || 'Non spécifié'}

Génère un plan d’entraînement journalier clair, court et structuré.

Règles :
1. Donne un titre en gras pour chaque partie :
   **Durée totale**
   **Échauffement**
   **Corps de séance**
   **Finisher / Cardio**
   **Étirements**

2. *Durée totale* : une phrase simple.
3. *Échauffement* : 2 à 4 exercices courts.
4. *Corps de séance* : minimum 3 exercices (format clair).
5. *Finisher* : 1 exercice intense.
6. *Étirements* : 2 mouvements.

Format propre, lisible, concis.
`
    };

    setMessages([userMessage]);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Start a chat with no history for now
      const chat = model.startChat({ history: [] });

      const result = await chat.sendMessage([{ text: userMessage.text }]);
      const aiText = result.response.text();

      setMessages([{ role: 'user', text: userMessage.text }, { role: 'assistant', text: aiText }]);
    } catch (err) {
      console.error('Gemini error:', err);
      setMessages([{ role: 'assistant', text: 'Erreur lors de la requête.' }]);
    } finally {
      setLoading(false);
    }
  };

  const objectifsOptions = ['Perdre du gras', 'Rester sec et musclé', 'Prendre du muscle proprement'];
  const entrainementOptions = ['Musculation', 'Cardio', 'Boxe', 'Danse'];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white rounded-2xl shadow-md p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-black">
          Plan d'entraînement
        </h1>

        {/* ÂGE */}
        <div>
          <label className="font-semibold text-black">Âge</label>
          <input type="number" {...register('age')} className="w-full mt-2 p-3 border rounded-lg text-black" />
        </div>

        {/* TAILLE */}
        <div>
          <label className="font-semibold text-black">Taille (cm)</label>
          <input type="number" {...register('taille')} className="w-full mt-2 p-3 border rounded-lg text-black" />
        </div>

        {/* POIDS ACTUEL */}
        <div>
          <label className="font-semibold text-black">Poids actuel (kg)</label>
          <input type="number" {...register('poids_actuel')} className="w-full mt-2 p-3 border rounded-lg text-black" />
        </div>

        {/* OBJECTIF */}
        <div>
          <label className="font-semibold text-black">Objectif</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            {objectifsOptions.map((obj) => (
              <label
                key={obj}
                className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border cursor-pointer text-black"
              >
                <input type="radio" value={obj} {...register('objectifs')} />
                {obj}
              </label>
            ))}
          </div>
        </div>

        {/* TYPE D’ENTRAÎNEMENT */}
        <div>
          <label className="font-semibold text-black">Type d’entraînement préféré</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {entrainementOptions.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border cursor-pointer text-black"
              >
                <input type="radio" value={type} {...register('entrainement')} />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* POIDS CIBLE */}
        <div>
          <label className="font-semibold text-black">Poids cible</label>
          <input type="number" {...register('poids_cible')} className="w-full mt-2 p-3 border rounded-lg text-black" />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold"
        >
          Obtenir mon plan d'entraînement
        </motion.button>
      </form>

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-black space-y-4 flex flex-col items-center"
          >
            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full" />
            <p className="text-lg font-semibold">Chargement...</p>
          </motion.div>
        </div>
      )}

      {/* POPUP RESULT IA */}
      {messages.length > 0 && !loading && (
        <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-full h-full text-black space-y-4 flex flex-col"
          >
            <h2 className="text-2xl font-semibold">Résultat IA</h2>
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {messages.map((m) => (
                <p key={m.role} className="mb-2">
                  {m.role === 'user' ? 'Vous :' : 'Coach IA :'} {m.text}
                </p>
              ))}
            </div>
            <button
              onClick={() => setMessages([])}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
