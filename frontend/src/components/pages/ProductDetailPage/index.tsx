import { useEffect, useState } from "react";
import { TbArrowLeft } from "react-icons/tb";
import { useParams } from "react-router";
import ApiError from "../../../data/api-error.ts";
import { productRepository } from "../../../data/product";
import type { Product } from "../../../types/product";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import Button from "../../atoms/Button";
import LinkButton from "../../atoms/LinkButton";
import StatePanel from "../../molecules/StatePanel";
import ProductDetail from "../../organisms/ProductDetail";
import styles from "./styles.module.css";

type DetailState =
  | { status: "loading" }
  | { status: "success"; product: Product }
  | { status: "not-found" }
  | { status: "error"; message: string };

function BackLink() {
  return (
    <LinkButton to="/products" variant="secondary">
      <TbArrowLeft aria-hidden="true" />
      Kembali ke daftar produk
    </LinkButton>
  );
}

function ProductDetailContent({ productId }: { productId: number }) {
  const [state, setState] = useState<DetailState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    productRepository
      .getProduct(productId)
      .then((model) => {
        if (!ignore) setState({ status: "success", product: model.toJSON() });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        // Backend membalas 404 kalau id tidak ada di database
        if (error instanceof ApiError && error.status === 404) {
          setState({ status: "not-found" });
        } else {
          setState({
            status: "error",
            message: getErrorMessage(error, "Gagal memuat produk."),
          });
        }
      });
    return () => {
      ignore = true;
    };
  }, [productId, attempt]);

  function handleRetry() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }

  if (state.status === "loading") {
    return (
      <p role="status" className={styles.notice}>
        Memuat produk...
      </p>
    );
  }

  if (state.status === "not-found") {
    return (
      <StatePanel
        code="404"
        title="Produk tidak ditemukan"
        message={`Produk dengan ID ${productId} tidak ada atau sudah dihapus.`}
      >
        <BackLink />
      </StatePanel>
    );
  }

  if (state.status === "error") {
    return (
      <StatePanel title="Gagal memuat produk" message={state.message}>
        <Button onClick={handleRetry}>Coba lagi</Button>
        <BackLink />
      </StatePanel>
    );
  }

  return (
    <>
      <div className={styles.back}>
        <BackLink />
      </div>
      <ProductDetail product={state.product} />
    </>
  );
}

export default function ProductDetailPage() {
  const { id = "" } = useParams();

  // ID di URL harus bilangan bulat positif, misalnya /products/3
  if (!/^[1-9]\d*$/.test(id)) {
    return (
      <StatePanel
        title="ID produk tidak valid"
        message={`"${id}" bukan ID produk yang valid. ID harus berupa bilangan bulat positif.`}
      >
        <BackLink />
      </StatePanel>
    );
  }

  // key membuat state dimulai dari awal setiap kali ID di URL berganti
  return <ProductDetailContent key={id} productId={Number(id)} />;
}
