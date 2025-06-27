"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ArrowLeft,
  Mail,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function PasswordReset() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8)
      errors.push("La contraseña debe tener al menos 8 caracteres");
    if (!/[A-Z]/.test(password))
      errors.push("Debe contener al menos una letra mayúscula");
    if (!/[a-z]/.test(password))
      errors.push("Debe contener al menos una letra minúscula");
    if (!/[0-9]/.test(password))
      errors.push("Debe contener al menos un número");
    return errors;
  };

  const handleEmailSubmit = async () => {
    clearMessages();

    if (!email.trim()) {
      setError("El email es requerido");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);     
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al enviar el código");
      }

      setSuccess("Código de verificación enviado exitosamente");
      setTimeout(() => {
        setStep(2);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      if (err.message.includes("404")) {
        setError("No se encontró ninguna cuenta con este email");
      } else if (err.message.includes("500")) {
        setError("Error interno del servidor. Intenta nuevamente más tarde");
      } else {
        setError(err.message || "Error inesperado. Intenta nuevamente");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    clearMessages();

    if (!code.trim()) {
      setError("El código de verificación es requerido");
      return;
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError("El código debe tener exactamente 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      console.log("Verificando código para email:", email, "con código:", code);
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Código inválido o expirado");
      }

      setSuccess("Código verificado correctamente");
      setTimeout(() => {
        setStep(3);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      if (err.message.includes("400")) {
        setError("El código es inválido o ha expirado. Solicita uno nuevo");
      } else if (err.message.includes("500")) {
        setError("Error interno del servidor. Intenta nuevamente más tarde");
      } else {
        setError(err.message || "Error inesperado. Intenta nuevamente");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    clearMessages();

    if (!password || !confirmPassword) {
      setError("Ambas contraseñas son requeridas");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(". "));
      return;
    }

    setLoading(true);
    console.log(
      "Restableciendo contraseña para email:",  
      email,
      "con código:",
      code,
      "y nueva contraseña",
      password,
    );
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          new_password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Error al restablecer la contraseña"
        );
      }

      setSuccess("Contraseña actualizada exitosamente");
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 2000);
    } catch (err: any) {
      if (err.message.includes("400")) {
        setError(
          "El código es inválido o ha expirado. Inicia el proceso nuevamente"
        );
      } else if (err.message.includes("404")) {
        setError("Usuario no encontrado");
      } else if (err.message.includes("500")) {
        setError("Error interno del servidor. Intenta nuevamente más tarde");
      } else {
        setError(err.message || "Error inesperado. Intenta nuevamente");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    clearMessages();
    if (step === 2) {
      setStep(1);
      setCode("");
    } else if (step === 3) {
      setStep(2);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return <Mail className="w-6 h-6" />;
      case 2:
        return <Shield className="w-6 h-6" />;
      case 3:
        return <Lock className="w-6 h-6" />;
      default:
        return <Mail className="w-6 h-6" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Recuperar Contraseña";
      case 2:
        return "Verificar Código";
      case 3:
        return "Nueva Contraseña";
      default:
        return "Recuperar Contraseña";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Ingresa tu email para recibir un código de verificación";
      case 2:
        return "Ingresa el código de 6 dígitos enviado a tu email";
      case 3:
        return "Crea una nueva contraseña segura para tu cuenta";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                {getStepIcon()}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-center mb-4">
              {getStepDescription()}
            </CardDescription>

            {/* Progress indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-11"
                  />
                </div>
                <Button
                  onClick={handleEmailSubmit}
                  className="w-full h-11"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar código"}
                </Button>
              </div>
            )}

            {/* Step 2: Code verification with InputOTP */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="code" className="block text-center">
                    Código de verificación
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Código enviado a:{" "}
                    <span className="font-medium">{email}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={loading}
                    className="flex-1 h-11"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button
                    onClick={handleCodeSubmit}
                    className="flex-1 h-11"
                    disabled={loading || code.length !== 6}
                  >
                    {loading ? "Verificando..." : "Verificar"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: New password */}
            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="h-11"
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>La contraseña debe contener:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Al menos 8 caracteres</li>
                    <li>Una letra mayúscula</li>
                    <li>Una letra minúscula</li>
                    <li>Un número</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={loading}
                    className="flex-1 h-11"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11"
                    disabled={loading}
                  >
                    {loading ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
