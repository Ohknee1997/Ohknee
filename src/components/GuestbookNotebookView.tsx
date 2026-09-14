import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  getOrCreateDeviceId,
  recordDeviceSignature,
} from '../utils/deviceAnalytics';

export interface SignatureEntry {
  slot: number;
  name: string;
  date?: string;
  deviceId?: string;
}

const STORAGE_DEVICE_KEY = 'ohknee_guestbook_device_id_v2';
const STORAGE_MY_SIGNATURE_KEY = 'ohknee_guestbook_my_signature_v2';
const STORAGE_ALL_SIGNATURES_KEY = 'ohknee_guestbook_signatures_v2';

const TOTAL_SLOTS = 1000;

const INITIAL_SIGNATURES: Record<number, SignatureEntry> = {
  1: { slot: 1, name: 'OHKNEE' },
  2: { slot: 2, name: 'A.M.' },
  3: { slot: 3, name: 'J.D.' },
};

export const GuestbookNotebookView: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string>('');
  const [mySignature, setMySignature] = useState<SignatureEntry | null>(null);
  const [signatures, setSignatures] = useState<Record<number, SignatureEntry>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALL_SIGNATURES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_SIGNATURES, ...parsed };
        }
      }
    } catch {}
    return INITIAL_SIGNATURES;
  });

  const [inputInitials, setInputInitials] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [justSignedSlot, setJustSignedSlot] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = getOrCreateDeviceId();
    setDeviceId(id);

    try {
      const savedMySig = localStorage.getItem(STORAGE_MY_SIGNATURE_KEY);
      if (savedMySig) {
        const parsed: SignatureEntry = JSON.parse(savedMySig);
        setMySignature(parsed);
      }
    } catch {}
  }, []);

  // Compute next available slot (1 to 1000)
  const nextAvailableSlot = useMemo(() => {
    let i = 1;
    while (i <= TOTAL_SLOTS && signatures[i]) {
      i++;
    }
    return i <= TOTAL_SLOTS ? i : null;
  }, [signatures]);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mySignature) {
      setErrorMessage(`You have already left your initials on line #${mySignature.slot}!`);
      return;
    }

    if (!nextAvailableSlot) {
      setErrorMessage('All 1,000 visitor slots have been filled! Thank you everyone.');
      return;
    }

    const trimmed = inputInitials.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your initials.');
      return;
    }

    if (trimmed.length > 30) {
      setErrorMessage('Initials or name must be 30 characters or fewer.');
      return;
    }

    const targetSlot = nextAvailableSlot;
    const newEntry: SignatureEntry = {
      slot: targetSlot,
      name: trimmed,
      date: new Date().toLocaleDateString('en-US'),
      deviceId: deviceId,
    };

    const updated = { ...signatures, [targetSlot]: newEntry };
    setSignatures(updated);
    setMySignature(newEntry);
    setJustSignedSlot(targetSlot);
    setInputInitials('');

    // 1. Save locally
    try {
      localStorage.setItem(STORAGE_ALL_SIGNATURES_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_MY_SIGNATURE_KEY, JSON.stringify(newEntry));
    } catch {}

    // 2. Record in device analytics & keep track of what they click
    recordDeviceSignature(targetSlot, trimmed);

    // 3. Smooth scroll to newly signed row
    setTimeout(() => {
      const el = document.getElementById(`notebook-line-${targetSlot}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Fixed 1 to 1,000 slots array (no infinite generation)
  const lineNumbers = useMemo(() => {
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => i + 1);
  }, []);

  return (
    <div
      ref={containerRef}
      id="notebook-paper-container"
      className="w-full min-h-screen bg-neutral-950 py-4 px-2 sm:px-4 flex flex-col items-center pb-24"
    >
      {/* REAL NOTEBOOK PAPER SHEET */}
      <div className="w-full max-w-2xl bg-[#fdfbf7] rounded-md shadow-2xl border border-[#e5dec9] overflow-hidden flex flex-col relative text-neutral-900">
        
        {/* TOP SECTION OF NOTEBOOK */}
        <div className="pt-8 pb-6 px-6 sm:px-12 text-center border-b border-[#e2d6be] bg-[#fdfbf7]">
          {/* Exact Text Requested */}
          <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-neutral-900 leading-snug font-sans">
            Thank you for being one of the first thousand people to visit my website. Leave your initials here.
          </h1>

          {/* THE LITTLE BOX (INPUT BOX) */}
          <div className="mt-5 max-w-sm mx-auto">
            {mySignature ? (
              <div className="p-2.5 rounded border border-neutral-300 bg-neutral-100/70 text-xs font-mono text-neutral-700">
                You signed line #{mySignature.slot}: <strong className="text-black">{mySignature.name}</strong>
              </div>
            ) : nextAvailableSlot === null ? (
              <div className="p-2.5 rounded border border-amber-300 bg-amber-50 text-xs font-mono text-amber-800">
                All 1,000 visitor slots are signed!
              </div>
            ) : (
              <form onSubmit={handleSign} className="flex gap-2">
                <input
                  id="notebook-initials-input"
                  type="text"
                  value={inputInitials}
                  onChange={(e) => {
                    setInputInitials(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter initials here..."
                  maxLength={30}
                  className="flex-1 px-3 py-2 bg-white border border-neutral-400 rounded text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  id="notebook-sign-btn"
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex-shrink-0"
                >
                  Sign
                </button>
              </form>
            )}

            {errorMessage && (
              <p className="text-xs text-red-600 font-mono mt-1.5">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* RULED NOTEBOOK PAPER (CAPPED AT 1,000 LINES) */}
        <div
          id="ruled-notebook-paper-1000"
          className="relative w-full bg-[#fdfbf7] flex flex-col py-1"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 35px, #e7ddc4 36px)',
          }}
        >
          {/* Classic Notebook Left Red Margin Line */}
          <div className="absolute left-10 sm:left-14 top-0 bottom-0 w-[2px] bg-red-300/80 pointer-events-none" />

          {/* Lines 1 to 1000 */}
          {lineNumbers.map((lineNum) => {
            const entry = signatures[lineNum];
            const isMine = mySignature?.slot === lineNum;
            const isJustSigned = justSignedSlot === lineNum;

            return (
              <div
                key={`notebook-line-${lineNum}`}
                id={`notebook-line-${lineNum}`}
                className={`relative flex items-center h-[36px] px-2 sm:px-3 text-xs font-mono select-none ${
                  isJustSigned
                    ? 'bg-amber-100/70 font-bold'
                    : isMine
                    ? 'bg-neutral-200/50 font-bold'
                    : ''
                }`}
              >
                {/* Number on left of red line */}
                <div className="w-7 sm:w-11 text-right pr-2 text-[11px] font-bold text-neutral-400">
                  {lineNum}.
                </div>

                {/* Red margin spacer */}
                <div className="w-2 sm:w-3 flex-shrink-0" />

                {/* Name / Initials written on the ruled line */}
                <div className="flex-1 flex items-center min-w-0 pr-4">
                  {entry ? (
                    <span
                      className={`truncate text-sm sm:text-base font-semibold ${
                        isMine ? 'text-black font-bold underline' : 'text-neutral-900'
                      }`}
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      {entry.name}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}

          {/* BOTTOM CAPPING NOTE AT LINE 1000 */}
          <div className="w-full py-4 text-center border-t border-neutral-300 text-neutral-400 font-mono text-[11px]">
            — End of First 1,000 Visitors Register —
          </div>
        </div>
      </div>
    </div>
  );
};
