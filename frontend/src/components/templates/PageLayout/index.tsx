import styles from "./styles.module.css"
import { Outlet } from "react-router"
import Navbar from "../../organisms/Navbar"

export default function PageLayout() {
    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <Outlet />
            </main>
        </>
    )
}