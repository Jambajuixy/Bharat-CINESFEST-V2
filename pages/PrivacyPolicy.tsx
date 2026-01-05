
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  const goToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#/';
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1 border border-amber-500/20 rounded-full bg-amber-500/5 mb-4">
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.4em]">Legal Protocol • Oct 2024</span>
        </div>
        <h1 className="text-5xl font-serif font-bold gold-text mb-4">Privacy & Data Charter</h1>
        <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] font-bold">The Security of Your Creative Identity</p>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-500/10 rounded-tl-[2.5rem]"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-amber-500/10 rounded-br-[2.5rem]"></div>

        <div className="space-y-12 text-neutral-300">
          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-amber-500/30"></span>
              1. Identity and Anonymity
            </h2>
            <div className="pl-11 space-y-4 text-sm leading-relaxed text-neutral-400">
              <p>
                Bharat CINEFEST utilizes a decentralized "Internet Identity" simulation. We do not store traditional passwords. Your access is governed by your unique cryptographic <span className="text-amber-500/80 font-mono">Principal ID</span>. 
              </p>
              <p>
                We collect your Screen Name, Biography, and chosen Avatar to curate your festival profile. These details are public by design, reflecting your presence in our global cinematic community.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-amber-500/30"></span>
              2. Content Metadata & AI Processing
            </h2>
            <div className="pl-11 space-y-4 text-sm leading-relaxed text-neutral-400">
              <p>
                When you submit to the <span className="italic text-white">AI Cinema Hall</span>, our platform processes metadata related to the generative tools used (e.g., Gemini API, Midjourney). This data is used solely to verify contest eligibility and enhance gallery curation.
              </p>
              <p>
                We do not claim ownership of your creative prompts or source files; however, we store thumbnail assets and YouTube reference IDs to enable platform exhibition.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-amber-500/30"></span>
              3. Financial Telemetry
            </h2>
            <div className="pl-11 space-y-4 text-sm leading-relaxed text-neutral-400">
              <p>
                Transactions for Festival Entries, Contest Fees, and Premieres are processed through secure gateways. Bharat CINEFEST stores only the "Registration Hash" and transaction status (Success/Pending) for your profile history. We never store raw credit card or bank credentials.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-amber-500/30"></span>
              4. Exhibition Rights
            </h2>
            <div className="pl-11 space-y-4 text-sm leading-relaxed text-neutral-400">
              <p>
                By participating, you grant Bharat CINEFEST a non-exclusive license to showcase your film within our digital halls. You retain the right to delete your submission at any time, which will immediately purge the associated metadata from our active exhibition database.
              </p>
            </div>
          </section>

          <div className="pt-12 border-t border-neutral-800 text-center">
            <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.3em] mb-8">
              Queries regarding data may be directed to <span className="text-amber-500/50">bharatcinefest@gmail.com</span>
            </p>
            <button 
              onClick={goToHome}
              className="px-10 py-4 bg-red-carpet gold-glow rounded-full text-white font-bold text-[10px] uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl"
            >
              Back to the Gala
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
