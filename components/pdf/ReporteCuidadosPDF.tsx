// components/pdf/ReporteCuidadosPDF.tsx

import { Document, Page, Text, View, StyleSheet,Image, } from "@react-pdf/renderer";
import { format } from "date-fns";
import { Vacunacion } from "@/hooks/useVacunaciones";
import { TratamientosSanitarios } from "@/hooks/useTratamientosSanitarios";
import { InventarioAnimalOut } from "@/types/inventarioAnimal";
import { logoBase64 } from "../Logo"; // Ajusta la ruta según la ubicación real de tu archivo Logo.tsx

 
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  title: { fontSize: 16, marginBottom: 10 },
  sectionTitle: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  item: { marginBottom: 4 },
  row: { flexDirection: "row", marginBottom: 2 },
  label: { fontWeight: "bold", width: 120 },
  logo: {
    width: 64,
    height: 64,
    position: "absolute",
    right: 24,
    top: 24,
  },
});

interface Props {
  vacunaciones: Vacunacion[];
  tratamientos: TratamientosSanitarios[];
  inventarios: InventarioAnimalOut[];
}

export const ReporteCuidadosPDF = ({
  vacunaciones,
  tratamientos,
  inventarios,
}: Props) => {
  const getAnimalInfo = (id: number) => {
    const inv = inventarios.find((i) => i.animal.animal_id === id);
    return inv
      ? inv.animal
      : { numero_trazabilidad: "—", especie: { nombre_comun: "—" }, sexo: "—" };
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoBase64} style={styles.logo} />
        <Text style={styles.title}>Reporte de Próximos Cuidados</Text>
        <Text>Generado: {format(new Date(), "dd/MM/yyyy")}</Text>

        <Text style={styles.sectionTitle}>Próximas Vacunaciones</Text>
        {vacunaciones.length === 0 ? (
          <Text>No hay próximas vacunaciones registradas.</Text>
        ) : (
          vacunaciones.map((v) => {
            const animal = getAnimalInfo(v.animal_id);
            return (
              <View key={v.vacunacion_id} style={styles.item}>
                <View style={styles.row}>
                  <Text style={styles.label}>Animal:</Text>
                  <Text>
                    ID {v.animal_id} – {animal.numero_trazabilidad} –{" "}
                    {animal.especie.nombre_comun}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Próxima vacunación:</Text>
                  <Text>
                    {format(
                      new Date(v.proxima_vacunacion_sugerida!),
                      "dd/MM/yyyy"
                    )}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.sectionTitle}>
          Próximas Revisiones de Tratamientos
        </Text>
        {tratamientos.length === 0 ? (
          <Text>No hay próximas revisiones registradas.</Text>
        ) : (
          tratamientos.map((t) => {
            const animal = getAnimalInfo(t.animal.animal_id);
            return (
              <View key={t.tratamiento_id} style={styles.item}>
                <View style={styles.row}>
                  <Text style={styles.label}>Animal:</Text>
                  <Text>
                    ID {t.animal.animal_id} – {animal.numero_trazabilidad} –{" "}
                    {animal.especie.nombre_comun}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Próxima revisión:</Text>
                  <Text>
                    {format(new Date(t.proxima_revision!), "dd/MM/yyyy")}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </Page>
    </Document>
  );
};
