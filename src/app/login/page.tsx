"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="px-6 h-16 flex items-center border-b bg-background">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="bg-primary text-primary-foreground p-1 rounded-md">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">Tekurious LMS</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" />
            </div>
            <Link href="/users" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="relative w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Google (Coming Soon)
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
