'use client'

import { useState } from 'react';
import LoginModal from './LoginModal';

export default function CallToAction() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <section className="bg-blue-600 py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to Find Your New Home?</h2>
        <p className="mb-8 text-xl">Sign up now and start browsing thousands of rental properties.</p>
        <button
          onClick={openLoginModal}
          className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100 focus:outline-none"
        >
          Get Started
        </button>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </section>
  )
}  