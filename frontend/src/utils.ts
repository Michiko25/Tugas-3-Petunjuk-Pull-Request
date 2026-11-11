// 5000 -> "Rp5.000"
export const formatRupiah = (value: number): string =>
  `Rp${new Intl.NumberFormat("id-ID").format(value)}`;