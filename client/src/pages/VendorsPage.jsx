import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Users, Search, Building2, Phone } from 'lucide-react';

export default function VendorsPage() {
  const [search, setSearch] = useState('');

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors-list', search],
    queryFn: async () => {
      const res = await api.get(`/vendors?search=${encodeURIComponent(search)}`);
      return res.data.data;
    }
  });

  const formatPKR = (paisa = 0) => {
    return `PKR ${(paisa / 100).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vendors & Debtors Ledger</h1>
        <p className="text-sm text-slate-500">
          Downstream wholesale buyers, credit terms, and accounts receivable balances
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by vendor name or code..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Vendor Code</th>
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Payment Terms</th>
                <th className="px-6 py-4">Credit Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Loading vendors...</td>
                </tr>
              ) : vendors?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">No vendors found</td>
                </tr>
              ) : (
                vendors?.map(v => (
                  <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{v.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{v.name}</td>
                    <td className="px-6 py-4">{v.contactPerson || '—'}</td>
                    <td className="px-6 py-4 text-xs font-mono">{v.phone || '—'}</td>
                    <td className="px-6 py-4">{v.address?.city || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {v.paymentTermsDays} Days
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatPKR(v.creditLimitPaisa)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
