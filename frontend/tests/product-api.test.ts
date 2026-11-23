import { test } from "node:test"
import assert from "node:assert/strict"
import ApiError from "../src/data/api-error.ts"
import ProductModel from "../src/data/product/model/product-model.ts"
import ProductListParam from "../src/data/product/param/product-list-param.ts"
import ProductRemote from "../src/data/product/source/product-remote.ts"
import type { ProductRemoteSource } from "../src/data/product/source/product-remote.ts"
import ProductRepository from "../src/data/product/repository/product-repository.ts"

const sample = { id: 1, name: " Pulpen ", price: 5000 }
const baseUrl = "https://api.example.test"

// Format response backend: { status, message, data } dan { status: false, message }
const ok = (data: unknown, status = 200) =>
    Response.json({ status: true, message: "ok", data }, { status })
const fail = (message: string, status: number) =>
    Response.json({ status: false, message }, { status })

// Source palsu: semua method menolak, kecuali yang ditimpa oleh tes.
function fakeSource(
    overrides: Partial<ProductRemoteSource> = {},
): ProductRemoteSource {
    const unused = async () => {
        throw new Error("Tidak dipakai pada tes ini.")
    }
    return {
        getProductListRemote: unused,
        getProductRemote: unused,
        createProductRemote: unused,
        updateProductRemote: unused,
        deleteProductRemote: unused,
        ...overrides,
    }
}

test("model memetakan response ke produk UI tanpa field tambahan", () => {
    const model = ProductModel.fromResponse({
        ...sample,
        createdAt: "2026-11-23T00:00:00.000Z",
        updatedAt: "2026-11-23T00:00:00.000Z",
    })
    assert.equal(model.getId(), 1)
    assert.equal(model.getName(), "Pulpen")
    assert.equal(model.getPrice(), 5000)
    assert.deepEqual(model.toJSON(), { id: 1, name: "Pulpen", price: 5000 })
})

test("model menolak data API yang melanggar kontrak produk", () => {
    for (const data of [
        null,
        {},
        { ...sample, id: 0 },
        { ...sample, name: " " },
        { ...sample, price: "5000" },
        { ...sample, price: -1 },
        { ...sample, price: 1.5 },
        { ...sample, price: Infinity },
    ]) {
        assert.throws(() => ProductModel.fromResponse(data), TypeError)
    }
})

test("parameter query di-encode dan query kosong dihilangkan", () => {
    assert.equal(new ProductListParam().toQueryString(), "")
    const query = new ProductListParam({
        query: " Buku & Pulpen ",
    }).toQueryString()
    assert.equal(new URLSearchParams(query).get("q"), "Buku & Pulpen")
})

test("pipeline source → repository → model membuka format { status, data }", async () => {
    let calls = 0
    const source = ProductRemote({
        baseUrl: "https://api.example.test/api/",
        fetchImpl: async (url, options) => {
            calls++
            assert.ok(url instanceof URL)
            assert.equal(
                url.href,
                "https://api.example.test/api/products?q=pul",
            )
            assert.equal(options?.method, "GET")
            assert.equal(
                new Headers(options?.headers).get("Accept"),
                "application/json",
            )
            return ok([sample])
        },
    })
    const repository = ProductRepository(source)
    const models = await repository.getProductList(
        new ProductListParam({ query: "pul" }),
    )
    assert.equal(calls, 1)
    assert.ok(models[0] instanceof ProductModel)
    assert.equal(models[0].getName(), "Pulpen")
})

test("tanpa URL API tidak ada request HTTP", async () => {
    let called = false
    const source = ProductRemote({
        fetchImpl: async () => {
            called = true
            return new Response()
        },
    })
    await assert.rejects(source.getProductListRemote(), /VITE_API_BASE_URL/)
    assert.equal(called, false)
})

test("error backend menjadi ApiError berisi status dan pesan dari backend", async () => {
    const source = ProductRemote({
        baseUrl,
        fetchImpl: async () => fail("Produk tidak ditemukan", 404),
    })
    await assert.rejects(source.getProductRemote(999), (error: unknown) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.status, 404)
        assert.equal(error.message, "Produk tidak ditemukan")
        return true
    })
})

test("source memakai pesan HTTP saat body error bukan JSON dan menolak response sukses yang tidak valid", async () => {
    const serverError = ProductRemote({
        baseUrl,
        fetchImpl: async () => new Response("error", { status: 500 }),
    })
    await assert.rejects(serverError.getProductListRemote(), /HTTP 500/)

    const notJson = ProductRemote({
        baseUrl,
        fetchImpl: async () => new Response("not-json"),
    })
    await assert.rejects(
        notJson.getProductListRemote(),
        /Format response API tidak valid/,
    )
})

test("server yang tidak dapat dihubungi menghasilkan pesan yang jelas", async () => {
    const source = ProductRemote({
        baseUrl,
        fetchImpl: async () => {
            throw new TypeError("fetch failed")
        },
    })
    await assert.rejects(
        source.getProductListRemote(),
        (error: unknown) =>
            error instanceof ApiError &&
            error.status === 0 &&
            /Tidak dapat terhubung/.test(error.message),
    )
})

test("tambah, ubah, dan hapus memakai method, URL, dan body sesuai backend", async () => {
    const calls: { url: string; method?: string; body?: unknown }[] = []
    const source = ProductRemote({
        baseUrl,
        fetchImpl: async (url, options) => {
            calls.push({
                url: String(url),
                method: options?.method,
                body:
                    typeof options?.body === "string"
                        ? JSON.parse(options.body)
                        : undefined,
            })
            return ok({ id: 3, name: "Penggaris", price: 7000 })
        },
    })
    const repository = ProductRepository(source)

    const created = await repository.createProduct({ name: "Penggaris", price: 7000 })
    await repository.updateProduct(3, { name: "Penggaris", price: 7000 })
    await repository.deleteProduct(3)

    assert.equal(created.getId(), 3)
    assert.deepEqual(calls, [
        {
            url: `${baseUrl}/products`,
            method: "POST",
            body: { name: "Penggaris", price: 7000 },
        },
        {
            url: `${baseUrl}/products`,
            method: "PUT",
            body: { id: 3, name: "Penggaris", price: 7000 },
        },
        { url: `${baseUrl}/products/3`, method: "DELETE", body: undefined },
    ])
})

test("repository mengambil satu produk berdasarkan id", async () => {
    const repository = ProductRepository(
        fakeSource({ getProductRemote: async () => sample }),
    )
    const model = await repository.getProduct(1)
    assert.equal(model.getName(), "Pulpen")
})

test("repository menerima array kosong dan menolak non-array/ID duplikat", async () => {
    const empty = ProductRepository(
        fakeSource({ getProductListRemote: async () => [] }),
    )
    assert.deepEqual(await empty.getProductList(), [])
    for (const response of [{ data: [sample] }, [sample, sample]]) {
        const repository = ProductRepository(
            fakeSource({ getProductListRemote: async () => response }),
        )
        await assert.rejects(repository.getProductList(), TypeError)
    }
})