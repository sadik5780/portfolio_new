'use client';

import { useState } from 'react';
import PaymentSummary, { type CheckoutRequest } from './PaymentSummary';

interface CheckoutButtonProps {
  request: CheckoutRequest;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Self-contained "Pay Now" button that owns its PaymentSummary modal.
 * Drop it anywhere on the pricing page with a CheckoutRequest describing
 * the selected service + current amount breakdown.
 */
export default function CheckoutButton({
  request,
  className,
  children,
}: CheckoutButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
      >
        {children ?? 'Pay Now'}
      </button>

      <PaymentSummary
        open={open}
        onClose={() => setOpen(false)}
        request={open ? request : null}
      />
    </>
  );
}
