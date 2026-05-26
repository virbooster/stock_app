"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ExportButtons({ data }: { data: any[] }) {
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock");
    XLSX.writeFile(wb, "reporte_stock.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Stock", 14, 15);
    autoTable(doc, {
      head: [["ID", "Nombre", "Descripción", "Stock"]],
      body: data.map(p => [p.id, p.name, p.description, p.stock]),
      startY: 20,
    });
    doc.save("reporte_stock.pdf");
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportExcel} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Exportar Excel</button>
      <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Exportar PDF</button>
    </div>
  );
}
