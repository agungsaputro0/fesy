import { useState, useEffect } from "react";

interface OrderStats {
  pending: number;
  processing: number;
  shipped: number;
  completed: number;
}

export const useOrderNotifications = (sellerID: number | null) => {
  const [orderStats, setOrderStats] = useState<OrderStats>({
    pending: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!sellerID) return;

    try {
      const ordersData: any[] = JSON.parse(localStorage.getItem("orders") || "[]");

      // Filter hanya order yang mengandung produk dari seller ini
      const sellerOrders = ordersData.flatMap((order: any) =>
        order.orders
          .filter((o: any) => o.seller.id === sellerID) // Cek seller ID
          .flatMap((o: any) =>
            o.products.map((p: any) => ({
              status: p.status, // Status numerik
            }))
          )
      );

      // Hitung jumlah order berdasarkan status
      const stats = sellerOrders.reduce(
        (acc, { status }) => {
          if (status === 1) acc.pending++;
          else if (status === 2) acc.processing++;
          else if (status === 3) acc.shipped++;
          else if (status === 4) acc.completed++;
          return acc;
        },
        { pending: 0, processing: 0, shipped: 0, completed: 0 }
      );

      setOrderStats(stats);
    } catch (error) {
      console.error("Error parsing orders:", error);
    }
  }, [sellerID]); // Rerun jika sellerID berubah

  return orderStats;
};
