'use client';

import { motion } from 'framer-motion';
import { Order } from '@/types/fruit-shop';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto"
    >
      <div className="text-center mb-4">
        <div className="text-sm text-gray-500 font-semibold mb-2">🛒 Order</div>
        
        {/* Item Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-8xl mb-4"
        >
          {order.item.emoji}
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {order.item.name}
        </h2>
        
        {/* Order Details */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-bold text-purple-600">{order.quantity}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">Price each:</span>
            <span className="font-bold text-blue-600">${order.unitPrice}</span>
          </div>
          <div className="border-t-2 border-purple-200 pt-2 mt-2">
            <div className="flex justify-between items-center text-2xl">
              <span className="text-gray-700 font-semibold">Total:</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
                className="font-bold text-green-600"
              >
                ${order.total}
              </motion.span>
            </div>
          </div>
        </div>
        
        {/* Helpful hint */}
        <div className="mt-4 text-sm text-gray-500 italic">
          {order.quantity} × ${order.unitPrice} = ?
        </div>
      </div>
    </motion.div>
  );
}
