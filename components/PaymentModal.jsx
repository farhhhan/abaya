"use client";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);
const PaymentModal = ({
  currencySymbol,
  amountCents,
  subtotal,
  taxAmount,
  totalAmount,
  currencyCode = "usd",
  address,
  onClose,
  onCOD,
  onPaid,
}) => {
  const [tab, setTab] = useState("cod");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountCents, currency: currencyCode }),
        });
        const data = await res.json();
        if (res.ok && data?.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data?.error || "Failed to initialize payment.");
        }
      } catch (e) {
        setError("Network error initializing payment.");
      } finally {
        setLoading(false);
      }
    };
    if (tab === "card" && !clientSecret && amountCents > 0) {
      fetchClientSecret();
    }
  }, [tab, amountCents, currencyCode, clientSecret]);
  const stripeKeyMissing = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {" "}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>{" "}
      <div className="relative bg-white w-full max-w-lg rounded-md shadow-lg p-5">
        {" "}
        <div className="flex justify-between items-center mb-4">
          {" "}
          <h3 className="text-lg font-medium">Checkout</h3>{" "}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>{" "}
        </div>{" "}
        <div className="text-sm mb-4">
          {" "}
          <p>
            Deliver to:{" "}
            <span className="font-medium">
              {address
                ? `${address.fullName}, ${address.area}, ${address.city}, ${address.state}`
                : "No address selected"}
            </span>
          </p>{" "}
          <div className="mt-2 grid grid-cols-2 gap-2">
            {" "}
            <span>Subtotal:</span>
            <span className="text-right">
              {currencySymbol}
              {subtotal}
            </span>{" "}
            <span>Tax:</span>
            <span className="text-right">
              {currencySymbol}
              {taxAmount}
            </span>{" "}
            <span className="font-medium">Total:</span>
            <span className="text-right font-medium">
              {currencySymbol}
              {totalAmount}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex gap-2 mb-4">
          {" "}
          <button
            className={`px-3 py-1 border rounded ${
              tab === "cod" ? "bg-gray-100" : "bg-white"
            }`}
            onClick={() => setTab("cod")}
          >
            Cash on Delivery
          </button>{" "}
          <button
            className={`px-3 py-1 border rounded ${
              tab === "card" ? "bg-gray-100" : "bg-white"
            }`}
            onClick={() => setTab("card")}
          >
            Card (Stripe)
          </button>{" "}
        </div>{" "}
        {tab === "cod" ? (
          <div className="space-y-3">
            {" "}
            <p className="text-sm text-gray-600">
              You will pay in cash upon delivery. Confirm to place your order.
            </p>{" "}
            <button
              onClick={onCOD}
              className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
            >
              Confirm COD Order
            </button>{" "}
          </div>
        ) : (
          <div className="space-y-3">
            {" "}
            {stripeKeyMissing && (
              <p className="text-xs text-red-600">
                Stripe key missing. Please set
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
              </p>
            )}{" "}
            {error && <p className="text-xs text-red-600">{error}</p>}{" "}
            {loading && (
              <p className="text-sm text-gray-500">Initializing payment...</p>
            )}{" "}
            {!loading && clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
              >
                {" "}
                <CheckoutForm onSuccess={onPaid} />{" "}
              </Elements>
            ) : null}{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default PaymentModal;
