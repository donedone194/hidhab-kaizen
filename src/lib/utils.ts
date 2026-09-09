import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale } from "./i18n";
import { Order } from "./data-service";
import { getWilayaById } from "@/data/algeria-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDZD(amount: number, locale: Locale = "ar"): string {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    maximumFractionDigits: 0,
  }).format(amount);

  return locale === "ar" ? `${formatted} د.ج` : `${formatted} DZD`;
}

export function validateAlgerianPhone(phone: string): boolean {
  // Strip spaces, dashes, parentheses
  const clean = phone.replace(/[\s\-\(\)]/g, "");
  
  // Matches:
  // 05XXXXXXXX, 06XXXXXXXX, 07XXXXXXXX (10 digits)
  // +2135XXXXXXXX, +2136XXXXXXXX, +2137XXXXXXXX (12 chars)
  // 002135XXXXXXXX...
  // 2135XXXXXXXX...
  const algerianRegex = /^(0|\+213|00213|213)[567]\d{8}$/;
  return algerianRegex.test(clean);
}

export function formatAlgerianPhone(phone: string): string {
  const clean = phone.replace(/[\s\-\(\)]/g, "");
  if (clean.length === 10 && clean.startsWith("0")) {
    return `${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)}`;
  }
  return phone;
}

export function formatDate(dateString: string, locale: Locale = "ar"): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function exportOrdersToCSV(orders: Order[]): void {
  if (typeof window === "undefined") return;

  const headers = [
    "Order ID",
    "Date",
    "Customer Name",
    "Phone",
    "Wilaya",
    "Commune",
    "Address",
    "Delivery Type",
    "Product Cost (DZD)",
    "Delivery Fee (DZD)",
    "Total (DZD)",
    "Status",
    "Customer Note",
    "Internal Staff Note",
  ];

  const rows = orders.map((o) => {
    const wilaya = getWilayaById(o.wilaya_id);
    const wilayaName = wilaya ? `${wilaya.code} - ${wilaya.name_ar} (${wilaya.name_fr})` : o.wilaya_id;
    return [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toLocaleDateString()}"`,
      `"${o.customer_name.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${wilayaName}"`,
      `"${(o.commune_name || "").replace(/"/g, '""')}"`,
      `"${o.precise_address.replace(/"/g, '""')}"`,
      `"${o.delivery_type === "home" ? "Home" : "Office"}"`,
      o.product_price,
      o.delivery_price,
      o.total_price,
      `"${o.status}"`,
      `"${(o.customer_note || "").replace(/"/g, '""')}"`,
      `"${(o.internal_notes || "").replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `hidhab_kaizen_orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

