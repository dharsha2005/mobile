"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  type Cart,
  type CartItem
} from "../services/cartService";
import { formatPrice } from "../utils/formatPrice";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
      setError(null);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      setError(err?.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleQtyChange = async (item: CartItem, qty: number) => {
    if (qty < 1) return;
    try {
      const updated = await updateCartItem(item._id, qty);
      setCart(updated);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (item: CartItem) => {
    try {
      const updated = await removeCartItem(item._id);
      setCart(updated);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to remove item");
    }
  };

  const total =
    cart?.items.reduce((sum, i) => {
      if (!i.product || !i.product.price) return sum;
      return sum + i.product.price * i.quantity;
    }, 0) || 0;

  if (loading) {
    return (
      <div className="container">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Your Cart</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {(!cart || cart.items.length === 0) && <p>Your cart is empty.</p>}
      {cart && cart.items.length > 0 && (
        <div className="row">
          <div className="col-md-8">
            <ul className="list-group mb-3">
              {cart.items.filter(item => item.product).map((item) => (
                <li
                  key={item._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div className="fw-semibold">{item.product?.name || 'Unknown Product'}</div>
                    <div className="small text-muted">
                      {item.product?.price
                        ? `${formatPrice(item.product.price)} each`
                        : formatPrice(0)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      className="form-control form-control-sm"
                      style={{ width: 70 }}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQtyChange(item, Number(e.target.value) || 1)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Summary</h5>
                <p className="d-flex justify-content-between">
                  <span>Total</span>
                  <span className="fw-bold">{formatPrice(total)}</span>
                </p>
                <Link href="/checkout" className="btn btn-primary w-100">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

