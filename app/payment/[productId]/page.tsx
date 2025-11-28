"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Product, ListingPlan } from "@/types";
import Swal from "sweetalert2";
import { CheckCircle, Shield, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Declare Midtrans Snap global type
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = React.use(params);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [plans, setPlans] = useState<ListingPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading && !user) {
        router.push("/login");
        return;
      }

      if (loading) return;

      try {
        // Fetch Plans
        const plansRes = await fetch("/api/listing-plans");
        const plansData = await plansRes.json();

        if (plansData.success) {
          setPlans(plansData.data);
          // Auto select first plan
          if (plansData.data.length > 0) {
            setSelectedPlanId(plansData.data[0].id);
          }
        }

        // Mock Product Data for now since we can't easily fetch pending products via public API
        setProduct({ title: "Produk Anda", price: 0 } as Product);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, loading, router, productId]);

  const handlePayment = async () => {
    if (!selectedPlanId) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const response = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          listingPlanId: selectedPlanId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: "Pembayaran Berhasil!",
          text: "Produk Anda sekarang aktif.",
          icon: "success",
          confirmButtonColor: "#2D3250",
        }).then(() => {
          router.push("/profil?tab=barang-saya");
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: result.error || "Gagal memproses pembayaran",
          icon: "error",
          confirmButtonColor: "#2D3250",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan sistem",
        icon: "error",
        confirmButtonColor: "#2D3250",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3250]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/profil?tab=barang-saya"
          className="inline-flex items-center text-gray-600 hover:text-[#2D3250] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Barang Saya
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Aktifkan Iklan Anda
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih paket listing untuk menampilkan produk Anda di marketplace.
            Produk akan langsung aktif setelah pembayaran berhasil.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlanId === plan.id
                  ? "border-[#2D3250] bg-white shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {selectedPlanId === plan.id && (
                <div className="absolute top-4 right-4 text-[#2D3250]">
                  <CheckCircle className="w-6 h-6 fill-current" />
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-[#2D3250]">
                  Rp {plan.price.toLocaleString("id-ID")}
                </span>
                <span className="text-gray-500 ml-2">
                  / {plan.duration_days} hari
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Tayang di Marketplace
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-blue-500 mr-2" />
                  Transaksi Aman
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-orange-500 mr-2" />
                  Aktif {plan.duration_days} Hari
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Produk yang akan diaktifkan:</span>
            <span className="font-semibold text-gray-900">
              {product?.title || "Loading..."}
            </span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-gray-900">Total Pembayaran:</span>
            <span className="text-[#2D3250]">
              Rp{" "}
              {plans
                .find((p) => p.id === selectedPlanId)
                ?.price.toLocaleString("id-ID") || 0}
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={!selectedPlanId || isProcessing}
          className="w-full bg-[#2D3250] hover:bg-[#1f2337] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isProcessing ? "Memproses..." : "Bayar Sekarang"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Pembayaran diproses secara aman oleh Midtrans.
        </p>
      </div>
    </div>
  );
}
