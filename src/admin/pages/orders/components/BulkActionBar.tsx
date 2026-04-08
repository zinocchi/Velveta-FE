import React, { useState } from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkUpdate: (status: string) => void;
  onClearSelected: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onBulkUpdate,
  onClearSelected,
}) => {
  const [bulkStatus, setBulkStatus] = useState('');

  if (selectedCount === 0) return null;

  return (
    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-amber-800">
          {selectedCount} order{selectedCount > 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-3">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="px-3 py-1.5 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="">Change status to...</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={() => onBulkUpdate(bulkStatus)}
            disabled={!bulkStatus}
            className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
          <button
            onClick={onClearSelected}
            className="px-4 py-1.5 bg-white border border-amber-200 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;