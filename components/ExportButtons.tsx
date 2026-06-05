"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText } from "lucide-react";

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
    } else if (type === 'archivados') {
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
    <div className="flex gap-1.5">
      <button 
        onClick={exportExcel} 
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--border)] text-[var(--text-main)] rounded-md hover:bg-[var(--bg-app)] transition-all text-xs font-semibold shadow-sm"
      >
        <FileSpreadsheet size={14} className="text-green-600" /> Excel
      </button>
      <button 
        onClick={exportPDF} 
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--border)] text-[var(--text-main)] rounded-md hover:bg-[var(--bg-app)] transition-all text-xs font-semibold shadow-sm"
      >
        <FileText size={14} className="text-red-600" /> PDF
      </button>
    </div>
  );
}
