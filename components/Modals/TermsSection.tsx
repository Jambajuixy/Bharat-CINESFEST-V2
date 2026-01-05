
import React, { useState } from 'react';

interface TermsSectionProps {
  onAgree: (agreed: boolean) => void;
}

const TermsSection: React.FC<TermsSectionProps> = ({ onAgree }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const nextValue = !isChecked;
    setIsChecked(nextValue);
    onAgree(nextValue);
  };

  return (
    <div className="mt-6 border border-amber-500/20 rounded-xl bg-black/60 p-5 shadow-inner">
      <div className="flex justify-between items-center mb-3">
        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-500 hover:text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
        >
          {isExpanded ? 'Collapse Legal Text' : 'View Full Agreement'}
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <span className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest">Effective: Oct 2024</span>
      </div>
      
      {isExpanded ? (
        <div className="text-[10px] text-neutral-400 max-h-64 overflow-y-auto mb-5 pr-3 space-y-5 thin-scrollbar animate-in fade-in duration-300 text-justify">
          <p className="font-bold text-neutral-300 italic">
            PLEASE READ THIS TERMS OF PARTICIPATION AGREEMENT ("AGREEMENT") CAREFULLY. BY SUBMITTING CONTENT OR AGREEING TO THESE TERMS, YOU ENTER INTO A LEGALLY BINDING CONTRACT WITH THE CINEMATIC GALA FESTIVAL COMMITTEE.
          </p>

          <section>
            <h5 className="text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/10 pb-1">1. REPRESENTATIONS AND WARRANTIES OF OWNERSHIP</h5>
            <p className="leading-relaxed">
              The Participant ("Creator") represents and warrants that they are the sole author and exclusive owner of the copyright of the submitted film ("the Work"). The Creator warrants that the Work does not infringe upon any third-party intellectual property rights, including but not limited to copyrights, trademarks, or rights of publicity. If the Work utilizes third-party assets (music, stock footage, likenesses), the Creator must possess valid written licenses for global digital exhibition.
            </p>
          </section>

          <section>
            <h5 className="text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/10 pb-1">2. GRANT OF EXHIBITION AND PROMOTIONAL LICENSE</h5>
            <p className="leading-relaxed">
              The Creator hereby grants the Cinematic Gala a non-exclusive, irrevocable, worldwide, royalty-free license to host, stream, publicly perform, and distribute the Work on the Cinematic Gala platform. Furthermore, the Creator grants the Festival the right to utilize excerpts, stills, and trailers of the Work (not exceeding 15% of total runtime) for promotional purposes across all digital media channels in perpetuity.
            </p>
          </section>

          <section>
            <h5 className="text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/10 pb-1">3. PROHIBITED CONTENT AND MANDATORY DISQUALIFICATION</h5>
            <p className="leading-relaxed space-y-2">
              <span className="block"><strong>3.1 Nudity and Sexually Explicit Content:</strong> The Cinematic Gala strictly prohibits the submission of content featuring gratuitous nudity, sexually explicit acts, or pornography. While artistic representations are reviewed on a case-by-case basis, any content deemed predominantly prurient or obscene by the Festival Committee will be summarily disqualified without refund.</span>
              <span className="block"><strong>3.2 Child Sexual Abuse Material (CSAM):</strong> The Cinematic Gala maintains a ZERO TOLERANCE policy regarding Child Sexual Abuse Material. Any submission containing, depicting, or promoting the sexual exploitation of minors is strictly prohibited. In accordance with international law, the Festival Committee will immediately terminate the account of any user found to be uploading such material and will report the violation, including all associated metadata and IP addresses, to the National Center for Missing & Exploited Children (NCMEC) and relevant law enforcement agencies.</span>
            </p>
          </section>

          <section>
            <h5 className="text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/10 pb-1">4. COMPETITION INTEGRITY AND JUDICIAL FINALITY</h5>
            <p className="leading-relaxed">
              For entries in the "Contest" or "Competition" categories, the Creator acknowledges that scoring is a subjective artistic evaluation. Scores provided by the appointed Jury and votes cast by the Audience are final and not subject to appeal or legal challenge. The Festival Committee reserves the right to disqualify any entry found to be utilizing fraudulent voting methods (e.g., botting, sybil attacks) without notice.
            </p>
          </section>

          <section>
            <h5 className="text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/10 pb-1">5. AI-GENERATED CONTENT COMPLIANCE</h5>
            <p className="leading-relaxed">
              Participants in "AI Cinema" categories must explicitly disclose the use of generative artificial intelligence. The Creator warrants that their use of AI tools complies with the respective tool's Terms of Service and that the final output does not violate established ethical guidelines or copyright law. "Deepfake" technology utilized without the express written consent of the depicted individual is strictly prohibited.
            </p>
          </section>

          <section>
            <h5 className="text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/10 pb-1">6. FINANCIAL TERMS AND TRANSACTION FINALITY</h5>
            <p className="leading-relaxed">
              All submission fees are considered administrative costs associated with curation, digital hosting, and prize pool allocation. Once a payment is processed via the platform's payment gateway, it is final and non-refundable, regardless of the selection outcome or the Creator's subsequent withdrawal of the Work.
            </p>
          </section>

          <section>
            <h5 className="text-amber-500 font-bold uppercase tracking-wider mb-2 border-b border-amber-500/10 pb-1">7. LIMITATION OF LIABILITY AND INDEMNIFICATION</h5>
            <p className="leading-relaxed">
              The Cinematic Gala shall not be held liable for any technical failures, unauthorized access to user data, or infringement claims brought by third parties against a Creator's submission. The Creator agrees to indemnify and hold harmless the Cinematic Gala, its officers, and affiliates from any and all claims, damages, or legal fees arising from a breach of the warranties set forth in Section 1.
            </p>
          </section>

          <div className="pt-4 border-t border-neutral-800 text-[8px] italic text-neutral-600">
            This Agreement is governed by international digital commerce standards. Any disputes shall be settled via binding arbitration. Failure to comply with prohibited content clauses (Section 3) results in immediate ban.
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-[10px] text-neutral-500 italic leading-relaxed">
            Agreement covers: IP warranties, Exhibition Licensing, Prohibited Content (CSAM & Nudity), Competition Rules, AI Disclosure, and Indemnification.
          </p>
        </div>
      )}

      <label className="group flex items-start gap-3 cursor-pointer select-none">
        <div className="relative flex items-center mt-0.5">
          <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={handleToggle}
            className="peer appearance-none w-5 h-5 bg-neutral-800 border border-neutral-700 rounded-md checked:bg-amber-500 checked:border-amber-500 transition-all cursor-pointer"
          />
          <svg className="absolute w-3.5 h-3.5 text-black left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-neutral-200 group-hover:text-amber-400 transition-colors">
            I certify that I have read and agree to be legally bound by these Terms
          </span>
          <span className="text-[9px] text-neutral-600 font-medium">Acceptance constitutes a valid electronic signature for festival participation.</span>
        </div>
      </label>
    </div>
  );
};

export default TermsSection;
