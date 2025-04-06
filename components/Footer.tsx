import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">InvenTrack</h3>
            <p className="text-gray-400">Soluciones de gestión de inventario para empresas modernas.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="hover:text-blue-400">
                  Características
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-400">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400">
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
            <p className="text-gray-400 mb-2">Email: info@inventrackapp.com</p>
            <p className="text-gray-400">Teléfono: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2023 InvenTrack. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

