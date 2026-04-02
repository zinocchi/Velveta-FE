import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Detail #{id}</h1>
      <p className="text-gray-600">Order detail page coming soon...</p>
    </div>
  );
};

export default OrderDetailPage;