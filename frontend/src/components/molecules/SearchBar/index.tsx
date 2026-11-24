import { TbSearch } from "react-icons/tb";
import styles from "./styles.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Cari nama produk...",
}: Props) {
  return (
    <div className={styles.wrapper}>
      <TbSearch className={styles.icon} aria-hidden="true" />
      <input
        type="search"
        aria-label="Cari produk"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
