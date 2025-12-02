"use client";
import React, { useMemo, useState } from 'react';
import { BinData,BinStatus,BinType } from '@/types/BinData'; 
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

const getFillLevelColor = (fillLevel: number): string => {
  if (fillLevel >= 80) return 'bg-red-500';
  if (fillLevel >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getTypeTagStyle = (type: BinType): string => {
  switch (type) {
    case 'plastic':
      return 'bg-blue-100 text-blue-800';
    case 'organic':
      return 'bg-green-100 text-green-800';
    case 'glass':
      return 'bg-red-100 text-red-800';
    case 'paper':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusTagStyle = (status: BinStatus): string => {
  switch (status) {
    case 'normal':
      return 'bg-green-100 text-green-800';
    case 'broken':
      return 'bg-red-100 text-red-800';
    case 'under_maintenance':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface BinsTableProps {
  bins: BinData[];
}

const BinsTable: React.FC<BinsTableProps> = ({ bins }) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredBins = useMemo(() => {
    if (!selectedType || selectedType === 'all') return bins;
    return bins.filter((b) => b.type === (selectedType as BinType));
  }, [bins, selectedType]);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Bin Status</h2>
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Bins</option>
            <option value="plastic">Plastic</option>
            <option value="organic">Organic</option>
            <option value="glass">Glass</option>
            <option value="paper">Paper</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden">
        <ul className="space-y-3">
          {filteredBins.map((bin) => (
            <li key={bin.id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-800">ID: {bin.id}</div>
                  <div className="text-xs text-gray-600">{bin.location[0].toFixed(4)}, {bin.location[1].toFixed(4)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700">{bin.type}</div>
                  <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(bin.lastEmptied as string), { addSuffix: true })}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex-1 pr-3">
                  <div className="w-full h-2 rounded-full bg-gray-200">
                    <div
                      className={`${getFillLevelColor(bin.fillLevel || 0)} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>
                <div className="ml-3 text-sm font-medium text-gray-900">{bin.fillLevel}%</div>
              </div>
              <div className="mt-3">
                <span className={`px-2 py-0.5 text-xs rounded ${getStatusTagStyle(bin.status)}`}>{bin.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop / Tablet: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bin ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fill Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                last Emptied
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredBins.map((bin) => (
              <tr key={bin.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 cursor-pointer">
                  {bin.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {bin.location[0].toFixed(4)}, {bin.location[1].toFixed(4)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getFillLevelColor(bin.fillLevel || 0)}`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">{bin.fillLevel}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeTagStyle(bin.type)}`}
                  >
                    {bin.type}
                  </span>
             </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusTagStyle(bin.status)}`}
                  >
                    {bin.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(bin.lastEmptied as string), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bins.length === 0 && (
        <p className="text-center py-8 text-gray-500">No bin data available.</p>
      )}
    </div>
  );
};

export default BinsTable;