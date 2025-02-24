import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Sistema de Inventario Inteligente
        </h1>
        <p className="text-gray-600 mt-2">
          Optimiza la gestión y predice la demanda con IA.
        </p>
        <Link href="/login">
          <Button className="mt-4">Iniciar Sesión</Button>
        </Link>
      </div>
    </main>
  );
}
