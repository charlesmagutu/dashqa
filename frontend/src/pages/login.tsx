import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Alert from "@/hooks/alert-hook";
import CustomAlert from "@/components/ui/custom-alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { alert, isVisible, showAlert } = Alert();

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("error", "Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/v1/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        showAlert("success", `Login successful: ${data.message}`);
      } else {
        showAlert("error", "Login failed: Invalid credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showAlert("error", "An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4">
        <CustomAlert type={alert.type as "success" | "error"} message={alert.message} isVisible={isVisible} />

        <Card className="w-[350px] bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@co-opbank.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
