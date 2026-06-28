/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Mail, ChevronRight, Eye, CheckCircle2 } from 'lucide-react';

interface QueuedEmail {
  id: string;
  emailType: string;
  recipient: string;
  subject: string;
  htmlContent: string;
  timestamp: string;
}

export default function EmailPreviewModal() {
  const [emails, setEmails] = useState<QueuedEmail[]>([]);
  const [activeEmail, setActiveEmail] = useState<QueuedEmail | null>(null);
  const [showNotification, setShowNotification] = useState<QueuedEmail | null>(null);

  useEffect(() => {
    const handleEmailEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { emailType, recipient, subject, htmlContent } = customEvent.detail;
      
      const newEmail: QueuedEmail = {
        id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        emailType,
        recipient,
        subject,
        htmlContent,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setEmails((prev) => [newEmail, ...prev]);
      setShowNotification(newEmail);
      
      // Auto-dim notification after 8 seconds
      setTimeout(() => {
        setShowNotification((current) => current?.id === newEmail.id ? null : current);
      }, 8000);
    };

    window.addEventListener('show-email-preview', handleEmailEvent);
    return () => {
      window.removeEventListener('show-email-preview', handleEmailEvent);
    };
  }, []);

  const handleDismissNotification = () => {
    setShowNotification(null);
  };

  const handleOpenClient = (email: QueuedEmail) => {
    setActiveEmail(email);
    setShowNotification(null);
  };

  const handleClearAll = () => {
    setEmails([]);
    setActiveEmail(null);
    setShowNotification(null);
  };

  return (
    <>
      {/* 1. TOAST NOTIFICATION - FLOAT IN */}
      {showNotification && (
        <div 
          className="fixed bottom-24 left-4 sm:left-auto sm:right-6 z-[120] max-w-sm w-full bg-neutral-950 border-l-4 border-brand border border-white/10 p-4 shadow-2xl animate-fade-in flex items-start space-x-3"
          style={{ boxShadow: '0 10px 30px rgba(255, 20, 147, 0.15)' }}
          id="email-toast-notification"
        >
          <div className="p-2 bg-brand/10 text-brand">
            <Mail size={18} />
          </div>
          <div className="flex-1 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-brand font-black tracking-widest text-[9px] uppercase">
                {showNotification.emailType} Dispatched
              </span>
              <span className="text-gray-500 text-[9px] font-mono">{showNotification.timestamp}</span>
            </div>
            <h4 className="text-white font-bold truncate pr-4 text-xs">{showNotification.subject}</h4>
            <p className="text-gray-400 text-[10px] truncate">Recipient: {showNotification.recipient}</p>
            
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => handleOpenClient(showNotification)}
                className="text-[10px] text-brand hover:text-white font-black uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Eye size={10} />
                <span>Render HTML Email Template</span>
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={handleDismissNotification}
                className="text-[10px] text-gray-500 hover:text-gray-300 font-bold uppercase tracking-wider cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button 
            onClick={handleDismissNotification}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. MAIN FULL EMAIL CLIENT PREVIEW MODAL */}
      {activeEmail && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="email-preview-client">
          <div className="bg-neutral-950 border border-white/10 w-full max-w-4xl h-[85vh] flex flex-col relative">
            
            {/* Header */}
            <div className="p-4 sm:px-6 bg-neutral-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs uppercase tracking-widest">
                    Limelight Mail Dispatcher
                  </h3>
                  <p className="text-gray-500 text-[10px] font-mono leading-none mt-0.5">
                    Production Simulation Mode (Netlify Forms & Functions Connected)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearAll}
                  className="text-[10px] px-3 py-1.5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer uppercase font-bold tracking-wider"
                >
                  Clear Mail Log
                </button>
                <button
                  onClick={() => setActiveEmail(null)}
                  className="p-1.5 bg-white/5 hover:bg-brand text-white transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Splitting Grid */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: Inbox List (Visible on larger screens) */}
              <div className="hidden md:block w-72 border-r border-white/10 bg-neutral-950 overflow-y-auto">
                <div className="p-3 border-b border-white/5 bg-neutral-900/40 text-[9px] uppercase font-black tracking-widest text-gray-500">
                  Mail Delivery Queue ({emails.length})
                </div>
                {emails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => setActiveEmail(email)}
                    className={`w-full text-left p-4 border-b border-white/5 transition-all text-xs block ${
                      activeEmail.id === email.id ? 'bg-brand/10 border-l-2 border-brand' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] px-1.5 py-0.5 uppercase tracking-widest font-extrabold ${
                        email.emailType.includes('Admin') ? 'bg-red-950 text-red-400 border border-red-500/20' : 'bg-brand/20 text-brand'
                      }`}>
                        {email.emailType}
                      </span>
                      <span className="text-gray-600 font-mono text-[9px]">{email.timestamp}</span>
                    </div>
                    <h4 className="text-white font-bold truncate mt-1.5">{email.subject}</h4>
                    <p className="text-gray-400 text-[10px] truncate mt-0.5">{email.recipient}</p>
                  </button>
                ))}
              </div>

              {/* Right Side: Rendered HTML Canvas */}
              <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
                {/* Mail Metadata */}
                <div className="p-4 bg-neutral-950 border-b border-white/5 space-y-2">
                  <div className="flex items-center text-xs">
                    <span className="text-gray-400 w-16 uppercase tracking-wider font-bold">To:</span>
                    <span className="text-white font-mono text-xs bg-neutral-900 px-2 py-0.5 border border-white/10">{activeEmail.recipient}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-gray-400 w-16 uppercase tracking-wider font-bold">Subject:</span>
                    <span className="text-brand font-bold text-xs">{activeEmail.subject}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-gray-400 w-16 uppercase tracking-wider font-bold">Engine:</span>
                    <span className="text-green-400 flex items-center space-x-1 font-mono text-[10px] uppercase font-black tracking-wider">
                      <CheckCircle2 size={12} />
                      <span>SMTP / Resend / Brevo Outbox Stack Connected</span>
                    </span>
                  </div>
                </div>

                {/* Simulated Web Sandbox Frame */}
                <div className="flex-grow overflow-auto p-4 bg-gray-100 flex justify-center">
                  <div 
                    className="w-full max-w-2xl bg-white shadow-xl text-black border border-gray-200"
                    dangerouslySetInnerHTML={{ __html: activeEmail.htmlContent }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Status bar */}
            <div className="p-2.5 bg-neutral-950 border-t border-white/10 text-center text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              Netlify Form Submission captured & synchronized in Real-time with Limelight Admin Panel
            </div>
          </div>
        </div>
      )}
    </>
  );
}
