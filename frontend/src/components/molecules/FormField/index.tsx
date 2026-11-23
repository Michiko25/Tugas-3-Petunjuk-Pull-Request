import type { InputHTMLAttributes } from "react"
import Input from "../../atoms/Input"
import styles from "./styles.module.css"

type Props = InputHTMLAttributes<HTMLInputElement> & {
    id: string
    label: string
    error?: string
    hint?: string
}

// Label + input + petunjuk. Pesan error menggantikan petunjuk saat ada.
export default function FormField({ id, label, error, hint, ...inputProps }: Props) {
    const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <Input
                id={id}
                invalid={Boolean(error)}
                aria-describedby={messageId}
                {...inputProps}
            />
            {error ? (
                <p id={messageId} className={styles.error}>
                    {error}
                </p>
            ) : hint ? (
                <p id={messageId} className={styles.hint}>
                    {hint}
                </p>
            ) : null}
        </div>
    )
}