import type { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
  title: string;
  message: string;
  code?: string;
  children?: ReactNode; // tombol atau tautan aksi
};

// Panel pesan di tengah halaman: 404, produk tidak ditemukan, atau gagal memuat data.
export default function StatePanel({ title, message, code, children }: Props) {
  return (
    <section className={styles.panel}>
      {code && <p className={styles.code}>{code}</p>}
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      {children && <div className={styles.actions}>{children}</div>}
    </section>
  );
}
