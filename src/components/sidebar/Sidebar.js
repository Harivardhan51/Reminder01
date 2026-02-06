// C:\Users\HP\reminder\src\components\Sidebar.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import './Sidebar.css';

export default function Sidebar({ pathname, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navItems = [
    { href: '/new-event', label: 'New Event', icon: '➕', color: 'blue' },
    { href: '/tasks', label: 'Tasks', icon: '📋', color: 'purple' },
  ];

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    if (!mounted) return;
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && mounted) {
      setIsOpen(false);
    }
  }, [pathname, isMobile, mounted]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (!mounted) return;
    
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen, mounted]);

  // Handle escape key to close sidebar
  useEffect(() => {
    if (!mounted) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, mounted]);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setIsOpen(false);
    logout();
  }, [logout]);

  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Render sidebar content (shared between SSR and client)
  const renderSidebarContent = (isAnimated = false) => (
    <>
      {/* Header - NO close button, hamburger handles it */}
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">
            <span>📅</span>
          </div>
          <div className="logo-text">
            <h1>Reminders</h1>
            <span>Event Manager</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main Menu</span>
          
          <ul className="nav-list">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li 
                  key={item.href} 
                  className={isAnimated ? "nav-item" : "nav-item-static"}
                  style={isAnimated ? { animationDelay: `${index * 0.1}s` } : undefined}
                >
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={`nav-link ${isActive ? 'active' : ''} ${item.color}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {isActive && (
                      <span className="nav-indicator">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout Section */}
        <div className="nav-section logout-section">
          <button className="logout-btn" onClick={handleLogout} type="button">
            <span className="nav-icon logout-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <span>A</span>
          </div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrator</span>
          </div>
          <div className="user-status">
            <span className="status-dot"></span>
          </div>
        </div>
      </div>
    </>
  );

  // SSR fallback - render desktop version
  if (!mounted) {
    return (
      <aside className="sidebar desktop" role="navigation" aria-label="Main navigation">
        {renderSidebarContent(false)}
      </aside>
    );
  }

  return (
    <>
      {/* Hamburger Button - Only on mobile */}
      {isMobile && (
        <button
          className={`hamburger-btn ${isOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          type="button"
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      )}

      {/* Overlay - Only on mobile */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {renderSidebarContent(isMobile && isOpen)}
      </aside>
    </>
  );
}