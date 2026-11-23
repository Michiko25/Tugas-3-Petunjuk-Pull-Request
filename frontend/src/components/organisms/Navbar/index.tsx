import { Link, NavLink } from "react-router"
import { TbPackage } from "react-icons/tb"
import styles from "./styles.module.css"

const links = [{ to: "/products", label: "Produk" }]

export default function Navbar() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav} aria-label="Navigasi utama">
                <Link to="/" className={styles.brand}>
                    <TbPackage className={styles.brandIcon} aria-hidden="true" />
                    <span>Manajemen Produk</span>
                </Link>
                <ul className={styles.list}>
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `${styles.link} ${isActive ? styles.active : ""}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}