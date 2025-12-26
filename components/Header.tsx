'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, signOut } = useAuth();
  const { getCartCount, cartAnimationTrigger } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (cartAnimationTrigger > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartAnimationTrigger]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>Reef Forge</h1>
        </Link>

        <div className={styles.rightSection}>
          {/* Cart - Always Visible */}
          <Link
            href="/cart"
            className={`${styles.cartLink} ${isAnimating ? styles.cartAnimating : ''}`}
          >
            <svg className={styles.cartIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className={styles.cartCount}>{getCartCount()}</span>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Navigation */}
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
          <div className={styles.navLeft}>
            <Link href="/" onClick={closeMobileMenu}>Home</Link>
            <Link href="/products" onClick={closeMobileMenu}>Products</Link>
            {user && (
              <Link href="/orders" onClick={closeMobileMenu}>Orders</Link>
            )}
          </div>

          <div className={styles.navRight}>
            {user ? (
              <div className={styles.userSection}>
                <div className={styles.userInfo}>
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || 'User'}
                      className={styles.userAvatar}
                    />
                  )}
                  <span className={styles.userName}>{user.user_metadata?.full_name || user.email}</span>
                </div>
                <button onClick={() => { signOut(); closeMobileMenu(); }} className={styles.signOutButton}>
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/signin" className={styles.signInLink} onClick={closeMobileMenu}>
                <svg className={styles.userIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu}></div>
      )}
    </header>
  );
}
