'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {session ? 'Welcome Back' : 'welcome'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {session ? (
            <>
              <p className="text-center text-gray-600">
                Signed in as <strong>{session.user?.email}</strong>
              </p>

              <Button
                className="w-full"
                variant="destructive"
                onClick={() => signOut({ callbackUrl: '/sign-in' })}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <p className="text-center text-gray-600">
                Sign in to start chatting with Bro
              </p>

              <Button
                className="w-full"
                onClick={() => signIn(undefined, { callbackUrl: '/chat' })}
              >
                Sign In
              </Button>

              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <a href="/sign-up" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
