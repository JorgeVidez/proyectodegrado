// components/pdf/ReporteVentasPDF.tsx

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { VentasOut } from "@/hooks/useVentas";
import { InventarioAnimalOut } from "@/types/inventarioAnimal";
import { logoBase64 } from "../Logo";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  logo: {
    width: 40,
    height: 40,
    position: "absolute",
    right: 24,
    top: 24,
  },
  title: { fontSize: 16, marginBottom: 6 },
  section: { marginBottom: 12 },
  headerRow: {
    flexDirection: "row",
    borderBottom: "1pt solid black",
    paddingBottom: 4,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    borderBottom: "0.5pt solid #ccc",
    paddingVertical: 2,
  },
  bold: { fontWeight: "bold" },
  cell: { flex: 1, paddingRight: 4 },
  subTitle: { fontSize: 12, marginTop: 8, marginBottom: 4, fontWeight: "bold" },
  animalRow: { flexDirection: "row", fontSize: 9, marginBottom: 2 },
});

interface Props {
  ventas: VentasOut[];
  startDate?: Date;
  endDate?: Date;
  inventarios: InventarioAnimalOut[];
}

export const ReporteVentasPDF = ({
  ventas,
  startDate,
  endDate,
  inventarios,
}: Props) => {
  const total = ventas.reduce(
    (acc, v) => acc + (v.precio_venta_total_general || 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoBase64} style={styles.logo} />
        <Text style={styles.title}>Reporte de Ventas</Text>
        <Text style={{ marginBottom: 8 }}>
          {startDate && `Desde: ${format(startDate, "dd/MM/yyyy")} `}
          {endDate && `Hasta: ${format(endDate, "dd/MM/yyyy")}`}
        </Text>

        {ventas.map((venta) => {
          const animales = inventarios.filter(
            (inv) =>
              inv.lote_actual_id === venta.lote_origen_id &&
              inv.motivo_egreso === "Venta"
          );

          return (
            <View key={venta.venta_id} style={styles.section}>
              <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.bold]}>Fecha:</Text>
                <Text style={styles.cell}>
                  {format(new Date(venta.fecha_venta), "dd/MM/yyyy")}
                </Text>
                <Text style={[styles.cell, styles.bold]}>Cliente:</Text>
                <Text style={styles.cell}>{venta.cliente?.nombre || "—"}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.cell}>
                  <Text style={styles.bold}>Lote: </Text>
                  {venta.lote_origen?.codigo_lote || "—"}
                </Text>
                <Text style={styles.cell}>
                  <Text style={styles.bold}>Animales vendidos: </Text>
                  {animales.length}
                </Text>
                <Text style={styles.cell}>
                  <Text style={styles.bold}>Total: </Text>$
                  {venta.precio_venta_total_general?.toLocaleString() || "0"}
                </Text>
              </View>

              <Text style={styles.subTitle}>Animales:</Text>
              {animales.length === 0 ? (
                <Text>No se encontraron animales para este lote.</Text>
              ) : (
                animales.map((a) => (
                  <View key={a.animal.animal_id} style={styles.animalRow}>
                    <Text style={styles.cell}>ID: {a.animal.animal_id}</Text>
                    <Text style={styles.cell}>
                      Trazabilidad: {a.animal.numero_trazabilidad}
                    </Text>
                    <Text style={styles.cell}>
                      Especie: {a.animal.especie.nombre_comun}
                    </Text>
                    <Text style={styles.cell}>Sexo: {a.animal.sexo}</Text>
                  </View>
                ))
              )}
            </View>
          );
        })}

        <View style={{ marginTop: 12 }}>
          <Text style={styles.bold}>
            Total global: ${total.toLocaleString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
