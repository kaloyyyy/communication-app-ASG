// app/protected/page.tsx
import { getServerSession } from 'next-auth';
import { handler as authHandler } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignOutButton from '../components/SignOutButton';

interface User {
   name: string;
   email: string;
   image?: string;
}

interface Session {
   user: User;
}

export default async function ProtectedPage() {
   const session = await getServerSession(authHandler) as Session;

   if (!session || !session.user) {
      redirect('/auth/signin');
      return null;
   }

   return (
      <div>
         <h1>Protected Page</h1>
         <p>Welcome, {session.user.name}!</p>
         <SignOutButton />
      </div>
   );
}
