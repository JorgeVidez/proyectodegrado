// components/pdf/DetalleAnimalPDF.tsx

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { AnimalOut } from "@/types/animal";
import { MovimientoAnimal } from "@/hooks/useMovimientosAnimal";
import { ControlesSanitarios } from "@/hooks/useControlesSanitarios";
import { Vacunacion } from "@/hooks/useVacunaciones";
import { TratamientosSanitarios } from "@/hooks/useTratamientosSanitarios";
import { logoBase64 } from "../Logo";


const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  sectionTitle: { fontSize: 14, marginBottom: 6, fontWeight: "bold" },
  label: { fontWeight: "bold" },
  item: { marginBottom: 4 },
  row: { marginBottom: 2 },
  logo: {
    width: 64,
    height: 64,
    position: "absolute",
    right: 24,
    top: 24,
  },
});

interface Props {
  animal: AnimalOut;
  movimientos: MovimientoAnimal[];
  controles: ControlesSanitarios[];
  vacunaciones: Vacunacion[];
  tratamientos: TratamientosSanitarios[];
}

export const DetalleAnimalPDF = ({
  animal,
  movimientos,
  controles,
  vacunaciones,
  tratamientos,
}: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoBase64} style={styles.logo} />

        <Text style={styles.sectionTitle}>Ficha de Animal</Text>

        <View style={styles.item}>
          <Text style={styles.row}>
            <Text style={styles.label}>ID:</Text> {animal.animal_id}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Trazabilidad:</Text>{" "}
            {animal.numero_trazabilidad}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>{" "}
            {animal.nombre_identificatorio || "-"}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Especie:</Text>{" "}
            {animal.especie.nombre_comun}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Raza:</Text> {animal.raza.nombre_raza}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Sexo:</Text> {animal.sexo}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Estado:</Text> {animal.estado_actual}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Movimientos</Text>
        {movimientos.length === 0 ? (
          <Text>No hay movimientos registrados.</Text>
        ) : (
          movimientos.map((m) => (
            <View key={m.movimiento_id} style={styles.item}>
              <Text style={styles.row}>
                <Text style={styles.label}>Fecha:</Text>{" "}
                {format(new Date(m.fecha_movimiento), "dd/MM/yyyy")}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Tipo:</Text> {m.tipo_movimiento}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Ubicación Origen:</Text>{" "}
                {m.origen_ubicacion?.nombre || "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Ubicación Destino:</Text>{" "}
                {m.destino_ubicacion?.nombre || "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Observaciones:</Text>{" "}
                {m.observaciones || "-"}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Controles Sanitarios</Text>
        {controles.length === 0 ? (
          <Text>No hay controles sanitarios registrados.</Text>
        ) : (
          controles.map((c) => (
            <View key={c.control_id} style={styles.item}>
              <Text style={styles.row}>
                <Text style={styles.label}>Fecha:</Text>{" "}
                {format(new Date(c.fecha_control!), "dd/MM/yyyy")}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Peso:</Text>{" "}
                {c.peso_kg ? `${c.peso_kg} kg` : "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Condición corporal:</Text>{" "}
                {c.condicion_corporal ?? "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Ubicación:</Text>{" "}
                {c.ubicacion?.nombre || "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Responsable:</Text>{" "}
                {c.responsable?.nombre || "-"}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Vacunaciones</Text>
        {vacunaciones.length === 0 ? (
          <Text>No hay vacunaciones registradas.</Text>
        ) : (
          vacunaciones.map((v) => (
            <View key={v.vacunacion_id} style={styles.item}>
              <Text style={styles.row}>
                <Text style={styles.label}>Fecha:</Text>{" "}
                {format(new Date(v.fecha_aplicacion), "dd/MM/yyyy")}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Dosis:</Text>{" "}
                {v.dosis_aplicada
                  ? `${v.dosis_aplicada} ${v.unidad_dosis || ""}`
                  : "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Lote vacuna:</Text>{" "}
                {v.lote_vacuna || "-"}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Tratamientos Sanitarios</Text>
        {tratamientos.length === 0 ? (
          <Text>No hay tratamientos registrados.</Text>
        ) : (
          tratamientos.map((t) => (
            <View key={t.tratamiento_id} style={styles.item}>
              <Text style={styles.row}>
                <Text style={styles.label}>Diagnóstico:</Text>{" "}
                {t.diagnostico || "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Fecha diagnóstico:</Text>{" "}
                {format(new Date(t.fecha_diagnostico), "dd/MM/yyyy")}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Medicamento:</Text>{" "}
                {t.medicamento?.nombre_comercial || "-"}
              </Text>
              <Text style={styles.row}>
                <Text style={styles.label}>Resultado:</Text>{" "}
                {t.resultado_tratamiento || "-"}
              </Text>
            </View>
          ))
        )}
      </Page>
    </Document>
  );
};
