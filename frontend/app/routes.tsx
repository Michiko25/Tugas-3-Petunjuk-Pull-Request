import RootPage from "./page"
import { Route, Routes } from "react-router"
import PageLayout from "../src/components/templates/PageLayout"
import NotFoundPage from "./not-found/page"
import ProductDetailPage from "./products/detail/page"
import ProductsPage from "./products/page"

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route index element={<RootPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}