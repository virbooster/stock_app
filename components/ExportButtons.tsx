"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ExportButtons({ data, type = 'stock' }: { data: any[], type?: string }) {
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `reporte_${type}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Reporte: ${type}`, 14, 15);
    
    let head: string[][] = [];
    let body: any[][] = [];

    if (type === 'stock') {
      head = [["ID", "Nombre", "Descripción", "Stock"]];
      body = data.map(p => [p.id, p.name, p.description, p.stock]);
    } else {
      head = [["Fecha", "Tipo", "Cantidad", "Motivo"]];
      body = data.map(m => [m.Fecha, m.Tipo, m.Cantidad, m.Motivo]);
    }

    autoTable(doc, {
      head,
      body,
      startY: 20,
    });
    doc.save(`reporte_${type}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportExcel} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Exportar Excel</button>
      <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Exportar PDF</button>
    </div>
  );
}
