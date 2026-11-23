import type { InputHTMLAttributes } from "react"
import styles from "./styles.module.css"

type Props = InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean
}

export default function Input({
    invalid = false,
    className = "",
    ...props
}: Props) {
    return (
        <input
            aria-invalid={invalid || undefined}
            className={`${styles.input} ${invalid ? styles.invalid : ""} ${className}`}
            {...props}
        />
    )
}