
import React, { useState, useMemo } from 'react';
import { StockEntry, Product } from '../types';
import { MOCK_PRODUCTS, MOCK_OUTLETS } from '../constants';
import { calculateEntryMetrics, formatCurrency } from '../utils/calculations';
import { FileDown, CalendarDays, Filter } from 'lucide-react';

interface ReportsProps {
  entries: StockEntry[];
}

const Reports: React.FC<ReportsProps> = ({ entries }) => {
  const [filterOutlet, setFilterOutlet] = useState('');

  // Group enriched entries by date and productId
  const pivotData = useMemo(() => {
    const data: Record<string, Record<string, any>> = {};
    const datesSet = new Set<string>();

    entries.forEach(e => {
      if (filterOutlet && e.outletId !== filterOutlet) return;
      
      const metrics = calculateEntryMetrics(e, MOCK_PRODUCTS, MOCK_OUTLETS);
      const date = e.entryDate;
      datesSet.add(date);

      if (!data[date]) data[date] = {};
      data[date][e.productId] = metrics;
    });

    const sortedDates = Array.from(datesSet).sort().reverse();
    return { data, sortedDates };
  }, [entries, filterOutlet]);

  const brands = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    MOCK_PRODUCTS.forEach(p => {
      if (!grouped[p.brand]) grouped[p.brand] = [];
      grouped[p.brand].push(p);
    });
    return grouped;
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Financial Pivot Report</h2>
          <p className="text-slate-500">Comprehensive profit and margin analysis grouped by brand.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={filterOutlet} 
              onChange={(e) => setFilterOutlet(e.target.value)}
              className="text-sm font-semibold outline-none bg-transparent"
            >
              <option value="">All Outlets</option>
              {MOCK_OUTLETS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <button 
            onClick={() => alert("Generating Excel Export...")}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-100 transition-all"
          >
            <FileDown size={20} />
            Export Excel
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest font-bold">
                <th className="px-4 py-3 w-12 border-r border-slate-800">Sl</th>
                <th className="px-4 py-3 w-64 border-r border-slate-800">Items</th>
                <th className="px-4 py-3 w-16 border-r border-slate-800 text-center">MRP</th>
                
                {pivotData.sortedDates.map(date => (
                  <th key={date} colSpan={6} className="px-4 py-3 text-center border-r border-slate-800 bg-slate-800">
                    <div className="flex items-center justify-center gap-2">
                      <CalendarDays size={14} className="text-indigo-400" />
                      {date}
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-slate-100 text-[9px] uppercase font-black text-slate-600 border-b border-slate-200">
                <th className="px-4 py-2 border-r border-slate-200"></th>
                <th className="px-4 py-2 border-r border-slate-200"></th>
                <th className="px-4 py-2 border-r border-slate-200"></th>
                {pivotData.sortedDates.map(date => (
                  <React.Fragment key={`sub-${date}`}>
                    <th className="px-2 py-2 text-center border-r border-slate-200 w-20">Stock</th>
                    <th className="px-2 py-2 text-center border-r border-slate-200 w-24">Amount</th>
                    <th className="px-2 py-2 text-center border-r border-slate-200 w-24">Profit</th>
                    <th className="px-2 py-2 text-center border-r border-slate-200 w-24">Mgn/Btl</th>
                    <th className="px-2 py-2 text-center border-r border-slate-200 w-20">Mgn%</th>
                    <th className="w-2 border-r border-slate-300 bg-slate-200/50"></th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(brands).map(([brand, products]) => (
                <React.Fragment key={brand}>
                  <tr className="bg-cyan-400 text-white font-black text-xs">
                    <td colSpan={3 + (pivotData.sortedDates.length * 6)} className="px-4 py-1.5 uppercase tracking-wide">
                      {brand}
                    </td>
                  </tr>
                  {products.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50 border-b border-slate-100 group">
                      <td className="px-4 py-2 text-[10px] text-slate-400 font-mono border-r border-slate-100">{idx + 1}</td>
                      <td className="px-4 py-2 text-xs font-semibold text-slate-700 border-r border-slate-100 truncate">{p.name}</td>
                      <td className="px-4 py-2 text-[10px] text-center font-mono text-slate-500 border-r border-slate-100">{p.mrp}</td>
                      {pivotData.sortedDates.map(date => {
                        const cell = pivotData.data[date]?.[p.id];
                        return (
                          <React.Fragment key={`${date}-${p.id}`}>
                            <td className="px-2 py-2 text-center text-xs font-bold border-r border-slate-50">{cell?.quantity || '-'}</td>
                            <td className="px-2 py-2 text-right text-xs font-medium text-indigo-600 border-r border-slate-50">{cell ? cell.amount.toFixed(2) : '-'}</td>
                            <td className={`px-2 py-2 text-right text-xs font-bold border-r border-slate-50 ${cell?.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {cell ? cell.profit.toFixed(2) : '-'}
                            </td>
                            <td className="px-2 py-2 text-right text-[10px] text-slate-500 border-r border-slate-50">{cell ? cell.marginPerBottle.toFixed(2) : '-'}</td>
                            <td className="px-2 py-2 text-center text-[10px] font-bold border-r border-slate-50">
                              {cell ? `${cell.margin.toFixed(1)}%` : '-'}
                            </td>
                            <td className="w-2 border-r border-slate-200 bg-slate-50/50"></td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="bg-slate-50/80 font-bold text-[10px]">
                    <td colSpan={3} className="px-4 py-2 text-right border-r border-slate-200 text-slate-500">Bill Amount</td>
                    {pivotData.sortedDates.map(date => {
                      const brandTotalAmt = products.reduce((sum, p) => sum + (pivotData.data[date]?.[p.id]?.amount || 0), 0);
                      const brandTotalProfit = products.reduce((sum, p) => sum + (pivotData.data[date]?.[p.id]?.profit || 0), 0);
                      return (
                        <React.Fragment key={`total-${date}-${brand}`}>
                          <td className="px-2 py-2"></td>
                          <td className="px-2 py-2 text-right border-r border-slate-200 text-indigo-700">{brandTotalAmt > 0 ? brandTotalAmt.toFixed(2) : ''}</td>
                          <td className="px-2 py-2 text-right border-r border-slate-200 text-emerald-700">{brandTotalProfit > 0 ? brandTotalProfit.toFixed(2) : ''}</td>
                          <td colSpan={3} className="border-r border-slate-200"></td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
