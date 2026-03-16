"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { CartProvider } from "../contexts/CartContext";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Dynamically import Bootstrap JS (for modals, dropdowns, etc.)
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gadgetra - Latest Electronic Gadgets</title>
        <meta name="description" content="Shop smartphones, laptops, accessories and more with fast delivery and secure checkout." />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {!pathname?.startsWith("/admin") && <Navbar />}
            <main className={pathname?.startsWith("/admin") ? "" : "py-4"}>{children}</main>
            {!pathname?.startsWith("/admin") && (
            <footer className="bg-dark text-white py-5 mt-5">
              <div className="container">
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <h5 className="text-uppercase fw-bold mb-4">
                      <i className="bi bi-shop me-2"></i>Gadgetra
                    </h5>
                    <p className="mb-4">
                      Your trusted source for the latest electronic gadgets and accessories. 
                      We offer premium quality products with fast delivery and exceptional customer service.
                    </p>
                    <div className="contact-info">
                      <p className="mb-2">
                        <i className="bi bi-geo-alt me-2"></i>
                        <strong>Address:</strong><br />
                        123, Brigade Road, MG Road<br />
                        Bangalore, Karnataka - 560001
                      </p>
                      <p className="mb-2">
                        <i className="bi bi-telephone me-2"></i>
                        <strong>Phone:</strong> +91 80 1234 5678
                      </p>
                      <p className="mb-2">
                        <i className="bi bi-envelope me-2"></i>
                        <strong>Email:</strong> support@gadgetra.in
                      </p>
                      <p className="mb-0">
                        <i className="bi bi-clock me-2"></i>
                        <strong>Hours:</strong><br />
                        Mon-Fri: 9AM-8PM<br />
                        Sat-Sun: 10AM-6PM
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <i className="bi bi-grid me-2"></i>Quick Links
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3">
                        <a href="/products" className="text-white text-decoration-none">
                          <i className="bi bi-box me-2"></i>All Products
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/products?category=smartphones" className="text-white text-decoration-none">
                          <i className="bi bi-phone me-2"></i>Smartphones
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/products?category=laptops" className="text-white text-decoration-none">
                          <i className="bi bi-laptop me-2"></i>Laptops
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/products?category=audio" className="text-white text-decoration-none">
                          <i className="bi bi-headphones me-2"></i>Audio
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/products?category=tablets" className="text-white text-decoration-none">
                          <i className="bi bi-tablet me-2"></i>Tablets
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/products?category=wearables" className="text-white text-decoration-none">
                          <i className="bi bi-smartwatch me-2"></i>Wearables
                        </a>
                      </li>
                      <li className="mb-0">
                        <a href="/deals" className="text-white text-decoration-none">
                          <i className="bi bi-tag me-2"></i>Special Deals
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <i className="bi bi-info-circle me-2"></i>Customer Service
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3">
                        <a href="/help" className="text-white text-decoration-none">
                          <i className="bi bi-question-circle me-2"></i>Help Center
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/shipping" className="text-white text-decoration-none">
                          <i className="bi bi-truck me-2"></i>Shipping & Delivery
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/returns" className="text-white text-decoration-none">
                          <i className="bi bi-arrow-return-left me-2"></i>Returns & Exchanges
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/warranty" className="text-white text-decoration-none">
                          <i className="bi bi-shield-check me-2"></i>Warranty Information
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/track-order" className="text-white text-decoration-none">
                          <i className="bi bi-search me-2"></i>Track Order
                        </a>
                      </li>
                      <li className="mb-0">
                        <a href="/contact" className="text-white text-decoration-none">
                          <i className="bi bi-chat-dots me-2"></i>Contact Support
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <i className="bi bi-shield-check me-2"></i>Policies
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3">
                        <a href="/privacy" className="text-white text-decoration-none">
                          <i className="bi bi-lock me-2"></i>Privacy Policy
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/terms" className="text-white text-decoration-none">
                          <i className="bi bi-file-text me-2"></i>Terms & Conditions
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/payment-methods" className="text-white text-decoration-none">
                          <i className="bi bi-credit-card me-2"></i>Payment Methods
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/shipping-policy" className="text-white text-decoration-none">
                          <i className="bi bi-box-seam me-2"></i>Shipping Policy
                        </a>
                      </li>
                      <li className="mb-3">
                        <a href="/refund-policy" className="text-white text-decoration-none">
                          <i className="bi bi-arrow-clockwise me-2"></i>Refund Policy
                        </a>
                      </li>
                      <li className="mb-0">
                        <a href="/faq" className="text-white text-decoration-none">
                          <i className="bi bi-question-square me-2"></i>FAQ
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <hr className="my-4 border-secondary" />
                
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <i className="bi bi-paypal me-2"></i>Payment Options
                    </h6>
                    <div className="payment-methods mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-credit-card-2-back me-2"></i>
                        <span>Visa, Mastercard, AMEX</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-paypal me-2"></i>
                        <span>PayPal</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-apple me-2"></i>
                        <span>Apple Pay</span>
                      </div>
                      <div className="d-flex align-items-center mb-0">
                        <i className="bi bi-google me-2"></i>
                        <span>Google Pay</span>
                      </div>
                    </div>
                    <p className="small text-muted mb-0">
                      <i className="bi bi-shield-check me-1"></i>
                      Secure payment processing with 256-bit SSL encryption
                    </p>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <i className="bi bi-truck me-2"></i>Shipping Information
                    </h6>
                    <div className="shipping-info">
                      <p className="mb-2">
                        <strong>Free Shipping:</strong> On orders over ₹999
                      </p>
                      <p className="mb-2">
                        <strong>Standard Delivery:</strong> 3-5 business days
                      </p>
                      <p className="mb-2">
                        <strong>Express Delivery:</strong> 1-2 business days
                      </p>
                      <p className="mb-2">
                        <strong>International:</strong> 7-14 business days
                      </p>
                      <p className="mb-0">
                        <strong>Cash on Delivery:</strong> Available across India
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <i className="bi bi-award me-2"></i>Why Choose Gadgetra?
                    </h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Premium Quality Products</span>
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Competitive Prices</span>
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Fast & Secure Delivery</span>
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>30-Day Return Policy</span>
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>24/7 Customer Support</span>
                      </li>
                      <li className="mb-0">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Secure Payment Processing</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <hr className="my-4 border-secondary" />
                
                <div className="text-center">
                  <div className="row">
                    <div className="col-12">
                      <h6 className="text-uppercase fw-bold mb-3">Stay Connected</h6>
                      <div className="social-links mb-4">
                        <a href="https://facebook.com/gadgetra" className="text-white me-3 text-decoration-none" target="_blank">
                          <i className="bi bi-facebook fs-4"></i>
                        </a>
                        <a href="https://twitter.com/gadgetra" className="text-white me-3 text-decoration-none" target="_blank">
                          <i className="bi bi-twitter fs-4"></i>
                        </a>
                        <a href="https://instagram.com/gadgetra" className="text-white me-3 text-decoration-none" target="_blank">
                          <i className="bi bi-instagram fs-4"></i>
                        </a>
                        <a href="https://linkedin.com/company/gadgetra" className="text-white me-3 text-decoration-none" target="_blank">
                          <i className="bi bi-linkedin fs-4"></i>
                        </a>
                        <a href="https://youtube.com/gadgetra" className="text-white text-decoration-none" target="_blank">
                          <i className="bi bi-youtube fs-4"></i>
                        </a>
                      </div>
                      
                      <div className="newsletter mb-4">
                        <p className="mb-3">Subscribe to our newsletter for exclusive deals and new product updates</p>
                        <div className="d-flex justify-content-center">
                          <input 
                            type="email" 
                            className="form-control me-2" 
                            placeholder="Enter your email"
                            style={{ maxWidth: "300px" }}
                          />
                          <button className="btn btn-primary">
                            <i className="bi bi-send me-1"></i>Subscribe
                          </button>
                        </div>
                      </div>
                      
                      <div className="apps mb-4">
                        <p className="mb-3">Download our mobile app for exclusive deals and easier shopping</p>
                        <div className="d-flex justify-content-center">
                          <a href="#" className="text-white me-3 text-decoration-none">
                            <i className="bi bi-apple fs-3"></i>
                            <small>App Store</small>
                          </a>
                          <a href="#" className="text-white text-decoration-none">
                            <i className="bi bi-google-play fs-3"></i>
                            <small>Google Play</small>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <hr className="my-4 border-secondary" />
                
                <div className="text-center">
                  <p className="mb-0">&copy; 2024 Gadgetra. All rights reserved.</p>
                  <div className="footer-links">
                    <a href="/sitemap" className="text-white me-3 text-decoration-none">Sitemap</a>
                    <a href="/accessibility" className="text-white me-3 text-decoration-none">Accessibility</a>
                    <a href="/careers" className="text-white text-decoration-none">Careers</a>
                    <a href="/press" className="text-white text-decoration-none">Press</a>
                    <a href="/investors" className="text-white text-decoration-none">Investors</a>
                  </div>
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="bi bi-globe me-1"></i>
                      India | English (INR)
                    </small>
                  </div>
                </div>
              </div>
            </footer>
            )}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

