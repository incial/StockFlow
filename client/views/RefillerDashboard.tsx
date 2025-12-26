
import React, { useState, useMemo } from 'react';
import { User, StockEntry, Product } from '../types';
import { MOCK_PRODUCTS, MOCK_OUTLETS } from '../constants';
import { Save, Calendar, Store, Info } from 'lucide-react';

interface RefillerDashboardProps {
  user: User;
  entries: StockEntry[];
  onAddEntries: (newEntries: StockEntry[]) => void;
}

const RefillerDashboard: React.FC<RefillerDashboardProps> = ({ user, onAddEntries }) => {
  const currentOutlet = MOCK_OUTLETS.find(o => o.id === user.outletId);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Track quantities and amounts by productId
  const [formData, setFormData] = useState<Record<string, { qty: string, amt: string }>>({});

  const productsByBrand = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    MOCK_PRODUCTS.forEach(p => {
      if (!grouped[p.brand]) grouped[p.brand] = [];
      grouped[p.brand].push(p);
    });
    return grouped;
  }, []);

  const handleInputChange = (productId: string, field: 'qty' | 'amt', value: string) => {
    setFormData(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { qty: '', amt: '' }),
        [field]: value
      }
    }));
  };

  const calculateBrandTotal = (brandProducts: Product[]) => {
    return brandProducts.reduce((sum, p) => sum + (parseFloat(formData[p.id]?.amt) || 0), 0);
  };

  const handleSave = () => {
    const newEntries: StockEntry[] = Object.entries(formData)
      .filter(([_, data]) => data.qty && data.amt)
      .map(([productId, data]) => ({
        id: `s-${Math.random().toString(36).substr(2, 9)}`,
        outletId: user.outletId!,
        productId,
        quantity: parseFloat(data.qty),
        amount: parseFloat(data.amt),
        entryDate,
        enteredBy: user.id,
        createdAt: new Date().toISOString()
      }));

    if (newEntries.length === 0) {
      alert("Please enter at least one valid stock entry.");
      return;
    }

    onAddEntries(newEntries);
    setFormData({});
    alert(`Successfully saved ${newEntries.length} entries for ${entryDate}.`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Stock Entry</h2>
            <p className="text-sm text-slate-500">{currentOutlet?.name} - Daily Intake</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
            />
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 transition-all"
          >
            <Save size={18} />
            Submit Batch
          </button>
        </div>
      </header>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3 text-blue-800 text-sm">
        <Info size={18} className="shrink-0 mt-0.5" />
        <p>Enter quantity and total purchase amount for the items delivered today. Bill amounts will auto-calculate per brand.</p>
      </div>

      <div className="space-y-8 pb-10">
        {Object.entries(productsByBrand).map(([brand, products]) => (
          <div key={brand} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-cyan-400 px-6 py-2 text-white font-bold text-sm tracking-wide">
              {brand}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                    <th className="px-6 py-3 w-16">Sl. No</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3 w-24 text-center">MRP</th>
                    <th className="px-6 py-3 w-32 text-center">Stock (Nos)</th>
                    <th className="px-6 py-3 w-40 text-center">Cost Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-2 text-xs text-slate-400 font-mono">{idx + 1}</td>
                      <td className="px-6 py-2 text-sm font-medium text-slate-700">{p.name}</td>
                      <td className="px-6 py-2 text-sm text-center font-mono text-slate-500">{p.mrp.toFixed(2)}</td>
                      <td className="px-6 py-2">
                        <input 
                          type="number"
                          placeholder="0"
                          value={formData[p.id]?.qty || ''}
                          onChange={(e) => handleInputChange(p.id, 'qty', e.target.value)}
                          className="w-full text-center py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-bold"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={formData[p.id]?.amt || ''}
                          onChange={(e) => handleInputChange(p.id, 'amt', e.target.value)}
                          className="w-full text-center py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-bold text-indigo-600"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-yellow-50/30">
                    <td colSpan={4} className="px-6 py-3 text-sm font-bold text-slate-600 text-right">Bill Amount for {brand}</td>
                    <td className="px-6 py-3 text-center text-sm font-bold text-indigo-700 bg-yellow-50">
                      ${calculateBrandTotal(products).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefillerDashboard;
