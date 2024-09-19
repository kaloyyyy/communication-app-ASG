// app/components/SignInButton.tsx
'use client';

import { signIn } from 'next-auth/react';

const SignInButton = () => {
   return (
      <button
         onClick={() => signIn()}
         className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
         Sign In
      </button>
   );
};

export default SignInButton;
