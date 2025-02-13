import { BarChart3, PackageSearch, TrendingUp } from "lucide-react"

const features = [
  {
    icon: <PackageSearch className="h-12 w-12 text-blue-500" />,
    title: "Seguimiento en tiempo real",
    description: "Mantén un control preciso de tu inventario con actualizaciones en tiempo real.",
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-blue-500" />,
    title: "Informes detallados",
    description: "Obtén insights valiosos con nuestros informes y análisis detallados.",
  },
  {
    icon: <TrendingUp className="h-12 w-12 text-blue-500" />,
    title: "Optimización de stock",
    description: "Optimiza tus niveles de inventario y reduce costos innecesarios.",
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

