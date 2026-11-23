import { Link } from "react-router"
import type { LinkProps } from "react-router"
import styles from "./styles.module.css"

const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    subtleDanger: "btn-subtle-danger",
}

type Props = LinkProps & {
    variant?: keyof typeof variants
}

// Tautan (Link) yang tampil seperti tombol. Dipakai untuk navigasi, bukan aksi.
export default function LinkButton({
    variant = "primary",
    className = "",
    children,
    ...props
}: Props) {
    return (
        <Link
            className={`${styles.button} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </Link>
    )
}