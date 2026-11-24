import type { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
  variant?: "error" | "info" | "success";
  children: ReactNode;
};

export default function Alert({ variant = "info", children }: Props) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`${styles.alert} ${styles[variant]}`}
    >
      {children}
    </div>
  );
}
