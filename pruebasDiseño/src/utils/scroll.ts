import React from 'react';

export const scrollToSection = (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element && (window as any).lenis) {
    (window as any).lenis.scrollTo(element, { offset: 0, duration: 1.5 });
  }
};
