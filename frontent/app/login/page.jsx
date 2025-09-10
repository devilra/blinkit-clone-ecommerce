"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { clearState, loginUser } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error, successMessage } = useSelector(
    (state) => state.auth
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const resultAction = await dispatch(loginUser({ email, password }));
    //console.log(resultAction);
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(successMessage);
      setTimeout(() => {
        router.push("/");
        setIsSubmitting(false);
      }, 500);
    } else {
      toast.error(error);
      setIsSubmitting(false);
    }
  };

  console.log(loading);

  //   useEffect(() => {
  //     if (error) toast.error(error);
  //     if (successMessage) {
  //       toast.success(successMessage);
  //       dispatch(clearState());
  //     }
  //   }, [successMessage, error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-amber-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <Button size="lg" className="w-full" disabled={loading || isSubmitting}>
          {loading && <Loader2Icon className="animate-spin" />}
          {loading ? "Logging in..." : "Login"}
        </Button>
        <p className="mt-4 text-center text-sm text-gray-500">
          New user?{" "}
          <Link href="/register" className="text-neutral-800 text-lg px-2">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
