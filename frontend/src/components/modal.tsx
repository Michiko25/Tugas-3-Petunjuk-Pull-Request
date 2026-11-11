import { useEffect } from "react";
import type { ReactNode } from "react";

interface Props {
  onClose: () => void;
  children: ReactNode;
}

// Kerangka pop-up: latar gelap, kotak putih, tombol tutup, dan tombol Esc
export default function Modal({ onClose, children }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Tutup" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}