import { useForm } from "react-hook-form";
import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { input } from "@/components/ui/input";
// import { p } from "@/components/ui/p";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useContext(AuthContext);
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    try {
      // Mock login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Login successful!" + JSON.stringify(data));
    } catch (e) {
      setErrorMessage("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      {/* <Card className="w-full max-w-sm p-4 shadow-md"> */}
      {/* <CardContent> */}
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <p>Email</p>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-3">
          <p>Password</p>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full"
          disabled={loading}
          onClick={() => {
            auth.changeLogin();
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {/* </CardContent> */}
      {/* </Card> */}
    </div>
  );
}
