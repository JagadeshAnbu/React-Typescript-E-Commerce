import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess }) => {
  return (
    <PayPalScriptProvider options={{ clientId: 'AZzgcA02FoJwFzvETSlojRMpTVY8Z9XHTAuonHIOj7vThnVZ0WESvlx-JOKPj0GTCOHPlr9PNeP5_XY6' }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
        if (actions && actions.order) {
            return actions.order.capture().then((details) => {
            onSuccess(details);
          });
        }
        return Promise.reject(new Error('actions.order is undefined'));
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
