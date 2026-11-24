import { useLocation } from "react-router";
import LinkButton from "../../atoms/LinkButton";
import StatePanel from "../../molecules/StatePanel";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <StatePanel
      code="404"
      title="Halaman tidak ditemukan"
      message={`Alamat ${pathname} tidak terdaftar di aplikasi ini.`}
    >
      <LinkButton to="/" variant="primary">
        Kembali ke beranda
      </LinkButton>
      <LinkButton to="/products" variant="secondary">
        Lihat daftar produk
      </LinkButton>
    </StatePanel>
  );
}
