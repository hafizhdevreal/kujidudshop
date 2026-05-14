"use client";

import { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "Angker Melon ( 1 Slop )",
    price: 102.000,
    image:
      "https://ibb.co.com/27XTd7ZY",
  },
  {
    id: 2,
    name: "Oversize Black Tee",
    price: 99000,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
  },
];

const fakeNames = [
  "Asep",
  "Rizky",
  "Dimas",
  "Fajar",
  "Budi",
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [fakeOrder, setFakeOrder] = useState("");

  const [address, setAddress] = useState("");
  const [wa, setWa] = useState("");

  const [payment, setPayment] = useState("qris");

  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [reffId, setReffId] = useState("");

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [confirmed, setConfirmed] =
    useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price,
    0
  );

  const paymentFee =
    payment === "cod" ? 30000 : 8000;

  const total = subtotal + paymentFee;

  const checkout = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/create-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            description: "Checkout KUJIDUD SHOP",
          }),
        }
      );

      const data = await res.json();

      if (data.status) {
        setQrImage(data.data.qr_image);
        setReffId(data.data.reff_id);
      } else {
        alert("Gagal membuat QRIS");
      }
    } catch (err) {
      alert("Terjadi error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reffId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          "/api/check-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reff_id: reffId,
            }),
          }
        );

        const data = await res.json();

        if (
          data.status &&
          data.data.status === "success"
        ) {
          setPaymentSuccess(true);
          clearInterval(interval);
        }
      } catch (err) {}
    }, 5000);

    return () => clearInterval(interval);
  }, [reffId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomName =
        fakeNames[
          Math.floor(Math.random() * fakeNames.length)
        ];

      const randomProduct =
        products[
          Math.floor(Math.random() * products.length)
        ];

      setFakeOrder(
        `${randomName} baru saja membeli ${randomProduct.name}`
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h1 className="text-2xl font-bold">
          KUJIDUD SHOP
        </h1>

        <div className="rounded-xl bg-white px-4 py-2 text-black font-semibold">
          Keranjang ({cart.length})
        </div>
      </nav>

      <section className="px-6 py-16 text-center">
        <h2 className="text-5xl font-black">
          Welcome To KUJIDUD SHOP
        </h2>

        <p className="mt-4 text-white/70">
          Koleksi fashion hitam premium.
        </p>
      </section>

      <section className="grid gap-6 px-6 pb-10 md:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
          >
            <img
              src={product.image}
              className="h-[350px] w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-2xl font-bold">
                {product.name}
              </h3>

              <p className="mt-2 text-white/70">
                Rp {product.price.toLocaleString("id-ID")}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-5 w-full rounded-2xl bg-white py-3 text-black font-semibold"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-white/10 px-6 py-10">
        <h2 className="text-3xl font-bold">
          Checkout
        </h2>

        <input
          type="text"
          placeholder="Alamat Rumah"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-6 w-full rounded-2xl bg-white/10 p-4 outline-none"
        />

        <input
          type="text"
          placeholder="Nomor WhatsApp"
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          className="mt-4 w-full rounded-2xl bg-white/10 p-4 outline-none"
        />

        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={payment === "qris"}
              onChange={() => setPayment("qris")}
            />
            QRIS (+Rp 8.000)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
            />
            COD (+Rp 30.000)
          </label>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p>
            Subtotal: Rp{" "}
            {subtotal.toLocaleString("id-ID")}
          </p>

          <p className="mt-2">
            Biaya Layanan: Rp{" "}
            {paymentFee.toLocaleString("id-ID")}
          </p>

          <p className="mt-4 text-3xl font-bold">
            Total: Rp{" "}
            {total.toLocaleString("id-ID")}
          </p>

          {!paymentSuccess && (
            <button
              onClick={checkout}
              className="mt-6 w-full rounded-2xl bg-white py-4 text-black font-bold"
            >
              {loading
                ? "Loading..."
                : "Checkout Sekarang"}
            </button>
          )}

          {qrImage && !paymentSuccess && (
            <img
              src={qrImage}
              className="mt-6 w-full rounded-2xl bg-white p-4"
            />
          )}

          {paymentSuccess && !confirmed && (
            <div className="mt-6">
              <div className="rounded-2xl bg-green-500 p-4 text-black font-bold">
                Pembayaran Berhasil
              </div>

              <p className="mt-4 text-white/70">
                Klik tombol dibawah untuk
                konfirmasi pembayaran
              </p>

              <button
                onClick={() =>
                  setConfirmed(true)
                }
                className="mt-4 w-full rounded-2xl bg-white py-4 text-black font-bold"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          )}

          {confirmed && (
            <div className="mt-6 rounded-2xl bg-yellow-500 p-4 text-black font-bold">
              Pesanan sedang diproses, mohon
              menunggu
            </div>
          )}
        </div>
      </section>

      <div className="fixed bottom-5 left-5 z-50 rounded-2xl bg-white px-5 py-3 text-black shadow-2xl">
        {fakeOrder || "Loading order..."}
      </div>
    </main>
  );
}
