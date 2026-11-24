import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import { TbX } from "react-icons/tb";
import styles from "./styles.module.css";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode; // ikon bernuansa merah, dipakai untuk konfirmasi hapus
  centered?: boolean;
  onClose: () => void;
  children: ReactNode;
};

// Kerangka pop-up: latar gelap, kotak putih, tombol tutup, dan tombol Esc.
export default function Modal({
  title,
  description,
  icon,
  centered = false,
  onClose,
  children,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Tutup"
          className={styles.close}
          onClick={onClose}
        >
          <TbX aria-hidden="true" />
        </button>
        <header className={centered ? styles.headerCentered : styles.header}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}
