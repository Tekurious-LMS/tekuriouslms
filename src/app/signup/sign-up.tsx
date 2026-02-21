"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            // Validate passwords match
            if (password !== passwordConfirmation) {
              toast.error("Passwords do not match");
              return;
            }

            // Validate password length
            if (password.length < 8) {
              toast.error("Password must be at least 8 characters long");
              return;
            }

            // Validate password strength
            const strongPasswordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
            if (!strongPasswordRegex.test(password)) {
              toast.error(
                "Password must include uppercase and lowercase letters, a number, and a special character",
              );
              return;
            }
            let imageBase64 = "";
            if (image) {
              try {
                imageBase64 = await convertImageToBase64(image);
              } catch {
                toast.error(
                  "Failed to process profile image. Please try again.",
                );
                return;
              }
            }
            // Store role in sessionStorage for post-signup processing
            if (role) {
              sessionStorage.setItem("pendingRole", role);
            }
            if (tenantSlug.trim()) {
              sessionStorage.setItem("pendingTenantSlug", tenantSlug.trim());
            } else {
              sessionStorage.removeItem("pendingTenantSlug");
            }

            await signUp.email({
              email,
              password,
              name: `${firstName} ${lastName}`,
              image: imageBase64 || undefined,
              callbackURL: "/onboarding",
              fetchOptions: {
                onResponse: () => {
                  setLoading(false);
                },
                onRequest: () => {
                  setLoading(true);
                },
                onError: (ctx: {
                  error: { code?: string; message?: string };
                }) => {
                  console.error("Sign-up error:", ctx.error);
                  if (
                    ctx.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
                  ) {
                    toast.error(
                      "An account with this email already exists. Please sign in instead.",
                    );
                  } else {
                    toast.error(ctx.error.message || "Sign-up failed");
                  }
                  sessionStorage.removeItem("pendingRole");
                  sessionStorage.removeItem("pendingTenantSlug");
                },
                onSuccess: (ctx) => {
                  if (ctx?.session) {
                    toast.success("Account created successfully!");
                    // Redirect is handled by auth-client
                  } else {
                    toast.success(
                      "Account created! Check your email to confirm before signing in.",
                    );
                  }
                },
              },
            });
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Max"
                required
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Robinson"
                required
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
              placeholder="Confirm Password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image (optional)</Label>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="Student">
                Student - Access learning materials
              </option>
              <option value="Teacher">
                Teacher - Manage courses and assessments
              </option>
              <option value="Parent">Parent - Monitor student progress</option>
              <option value="Admin">Admin - Manage school and users</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tenantSlug">Organization Slug (optional)</Label>
            <Input
              id="tenantSlug"
              placeholder="example-school"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Create your account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-center w-full border-t py-4 gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
