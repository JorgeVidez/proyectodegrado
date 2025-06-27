// components/pdf/HistorialAnimalPDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { Vacunacion } from "@/hooks/useVacunaciones";
import { TratamientosSanitarios } from "@/hooks/useTratamientosSanitarios";
import { InventarioAnimalOut } from "@/types/inventarioAnimal";
import { logoBase64 } from "../Logo";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  logo: {
    width: 64,
    height: 64,
    position: "absolute",
    right: 24,
    top: 24,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 12, marginBottom: 3 },
  sectionTitle: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "bold",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 3,
  },
  item: { marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { fontWeight: "bold", width: 120 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: { flexDirection: "row", marginBottom: 3 },
  tableCell: { width: "25%" },
  tableCellHeader: { width: "25%", fontWeight: "bold" },
});

interface Props {
  animal: InventarioAnimalOut;
  vacunaciones: Vacunacion[];
  tratamientos: TratamientosSanitarios[];
}

export const HistorialAnimalPDF = ({
  animal,
  vacunaciones,
  tratamientos
}: Props) => {
  // Separar vacunaciones en pasadas y futuras
  const hoy = new Date();
  const vacunacionesPasadas = vacunaciones.filter(v => 
    new Date(v.fecha_aplicacion) <= hoy
  );
  const vacunacionesFuturas = vacunaciones.filter(v => 
    v.proxima_vacunacion_sugerida && new Date(v.proxima_vacunacion_sugerida) > hoy
  );

  // Separar tratamientos en pasados y futuros
  const tratamientosPasados = tratamientos.filter(t => 
    t.fecha_fin_tratamiento && new Date(t.fecha_fin_tratamiento) <= hoy
  );
  const tratamientosFuturos = tratamientos.filter(t => 
    t.proxima_revision && new Date(t.proxima_revision) > hoy
  );
  const tratamientosEnCurso = tratamientos.filter(t => 
    (!t.fecha_fin_tratamiento || new Date(t.fecha_fin_tratamiento) > hoy) && 
    (!t.proxima_revision || new Date(t.proxima_revision) <= hoy)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoBase64} style={styles.logo} />

        {/* Encabezado del documento */}
        {/* Encabezado con información del animal */}
        <View style={styles.header}>
          <Text style={styles.title}>Historial Completo del Animal</Text>
          <View style={styles.row}>
            <Text style={styles.label}>ID Animal:</Text>
            <Text>{animal.animal.animal_id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de Trazabilidad:</Text>
            <Text>{animal.animal.numero_trazabilidad}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Especie:</Text>
            <Text>{animal.animal.especie.nombre_comun}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sexo:</Text>
            <Text>{animal.animal.sexo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Ingreso:</Text>
            <Text>{format(new Date(animal.fecha_ingreso), "dd/MM/yyyy")}</Text>
          </View>
          {animal.fecha_egreso && (
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de Egreso:</Text>
              <Text>{format(new Date(animal.fecha_egreso), "dd/MM/yyyy")}</Text>
            </View>
          )}
        </View>

        {/* Sección de Vacunaciones Pasadas */}
        <Text style={styles.sectionTitle}>Vacunaciones Aplicadas</Text>
        {vacunacionesPasadas.length === 0 ? (
          <Text>No hay vacunaciones registradas.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Fecha</Text>
              <Text style={styles.tableCellHeader}>Vacuna</Text>
              <Text style={styles.tableCellHeader}>Lote</Text>
              <Text style={styles.tableCellHeader}>Responsable</Text>
            </View>
            {vacunacionesPasadas.map((v) => (
              <View key={v.vacunacion_id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{format(new Date(v.fecha_aplicacion), "dd/MM/yyyy")}</Text>
                <Text style={styles.tableCell}>{v.tipo_vacuna.nombre_vacuna}</Text>
                <Text style={styles.tableCell}>{v.lote_vacuna || "—"}</Text>
                <Text style={styles.tableCell}>{v.responsable?.nombre || "—"}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sección de Vacunaciones Futuras */}
        <Text style={styles.sectionTitle}>Vacunaciones Programadas</Text>
        {vacunacionesFuturas.length === 0 ? (
          <Text>No hay vacunaciones programadas.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Fecha Programada</Text>
              <Text style={styles.tableCellHeader}>Vacuna Sugerida</Text>
              <Text style={styles.tableCellHeader}>Basado en</Text>
              <Text style={styles.tableCellHeader}>Observaciones</Text>
            </View>
            {vacunacionesFuturas.map((v) => (
              <View key={v.vacunacion_id} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {format(new Date(v.proxima_vacunacion_sugerida!), "dd/MM/yyyy")}
                </Text>
                <Text style={styles.tableCell}>
                  {v.tipo_vacuna.nombre_vacuna}
                </Text>
                <Text style={styles.tableCell}>
                  Aplicada el {format(new Date(v.fecha_aplicacion), "dd/MM/yyyy")}
                </Text>
                <Text style={styles.tableCell}>{v.observaciones || "—"}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sección de Tratamientos Pasados */}
        <Text style={styles.sectionTitle}>Tratamientos Realizados</Text>
        {tratamientosPasados.length === 0 ? (
          <Text>No hay tratamientos registrados.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Fecha Diagnóstico</Text>
              <Text style={styles.tableCellHeader}>Diagnóstico</Text>
              <Text style={styles.tableCellHeader}>Medicamento</Text>
              <Text style={styles.tableCellHeader}>Resultado</Text>
            </View>
            {tratamientosPasados.map((t) => (
              <View key={t.tratamiento_id} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {format(new Date(t.fecha_diagnostico), "dd/MM/yyyy")}
                </Text>
                <Text style={styles.tableCell}>{t.diagnostico || "—"}</Text>
                <Text style={styles.tableCell}>
                  {t.medicamento?.nombre_comercial || "—"}
                </Text>
                <Text style={styles.tableCell}>{t.resultado_tratamiento || "—"}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sección de Tratamientos en Curso */}
        <Text style={styles.sectionTitle}>Tratamientos en Curso</Text>
        {tratamientosEnCurso.length === 0 ? (
          <Text>No hay tratamientos en curso.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Inicio</Text>
              <Text style={styles.tableCellHeader}>Diagnóstico</Text>
              <Text style={styles.tableCellHeader}>Medicamento</Text>
              <Text style={styles.tableCellHeader}>Próxima Revisión</Text>
            </View>
            {tratamientosEnCurso.map((t) => (
              <View key={t.tratamiento_id} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {t.fecha_inicio_tratamiento 
                    ? format(new Date(t.fecha_inicio_tratamiento), "dd/MM/yyyy")
                    : "—"}
                </Text>
                <Text style={styles.tableCell}>{t.diagnostico || "—"}</Text>
                <Text style={styles.tableCell}>
                  {t.medicamento?.nombre_comercial || "—"}
                </Text>
                <Text style={styles.tableCell}>
                  {t.proxima_revision 
                    ? format(new Date(t.proxima_revision), "dd/MM/yyyy")
                    : "—"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Sección de Tratamientos Futuros */}
        <Text style={styles.sectionTitle}>Revisiones Programadas</Text>
        {tratamientosFuturos.length === 0 ? (
          <Text>No hay revisiones programadas.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Fecha Revisión</Text>
              <Text style={styles.tableCellHeader}>Diagnóstico</Text>
              <Text style={styles.tableCellHeader}>Veterinario</Text>
              <Text style={styles.tableCellHeader}>Observaciones</Text>
            </View>
            {tratamientosFuturos.map((t) => (
              <View key={t.tratamiento_id} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {format(new Date(t.proxima_revision!), "dd/MM/yyyy")}
                </Text>
                <Text style={styles.tableCell}>{t.diagnostico || "—"}</Text>
                <Text style={styles.tableCell}>
                  {t.responsable_veterinario?.nombre || "—"}
                </Text>
                <Text style={styles.tableCell}>{t.observaciones || "—"}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};