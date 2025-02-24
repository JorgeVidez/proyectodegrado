import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Gestiona tu inventario con facilidad
          </h1>
          <p className="text-xl mb-6">
            Optimiza tus operaciones y aumenta la eficiencia con nuestro
            software de gestión de inventario.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-100"
          >
            Comenzar prueba gratis
          </Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/images/wallp01.webp"
            alt="Gestión de inventario"
            width={500}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
