"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      registerUser({ name, email, phone, password })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } else {
      toast.error(resultAction.payload || "Registration failed. Try again!");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-t from-amber-50  h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Fill in your details below to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2Icon className="animate-spin" />}
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
        <p className="mt-5 text-center text-sm text-gray-500">
          Already register?{" "}
          <Link href="/login" className="text-neutral-800 text-lg px-2">
            Login
          </Link>
        </p>
        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full">
            Register with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
