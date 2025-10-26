"use client";
import React from 'react';

export default function CopyButton({ text }: { text: string }) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      //!fixed: fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }

  return (
    <button type="button" className="btn" onClick={handleCopy}>
      Copy
    </button>
  );
}
