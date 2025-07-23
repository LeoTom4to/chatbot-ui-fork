import React, { useState } from 'react';
import { Hero } from '@/components/Hero';
import { InputPanel } from '@/components/InputPanel';
import { ResultCard } from '@/components/ResultCard';
import { KnowledgeSlider } from '@/components/KnowledgeSlider';
import { AlertBar } from '@/components/AlertBar';

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <main className="min-h-screen bg-[#18181c] flex flex-col items-center justify-start pb-20">
      <Hero />
      <InputPanel onResult={setResult} />
      <ResultCard result={result} />
      <KnowledgeSlider />
      <AlertBar />
    </main>
  );
} 