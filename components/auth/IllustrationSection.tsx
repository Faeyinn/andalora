import React from 'react';
import Image from 'next/image';

export const IllustrationSection = () => {
  return (
    <div className="hidden lg:flex lg:w-2/3 relative bg-gray-100">
      <div className="absolute inset-0">
        <Image
          src="/bg-login-edmt.png"
          alt="Login Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};
