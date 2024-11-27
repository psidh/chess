'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { userState } from '../../recoil/userAtom';
import { useRecoilState } from 'recoil';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState('');
  if (status == 'unauthenticated') router.push('/');
  useEffect(() => {
    if (status === 'authenticated') {
      setEmail(session.user?.email);
      setUser({
        email,
        isAuthenticated: true,
      });

      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3002/api/auth/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
          });
          if (response.ok) {
            const data = await response.json();
            toast.success(data.message, {
              time: 5000,
            });
            setUser({
              email,
              isAuthenticated: true,
            });
            router.push('/home');
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Failed to fetch:', error);
        }
      };

      if (email) {
        fetchData();
      }
    }
  }, [email, session, status, router]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-2xl">Redirecting...</h1>
      <p>{session?.user?.email}</p>
    </div>
  );
}
