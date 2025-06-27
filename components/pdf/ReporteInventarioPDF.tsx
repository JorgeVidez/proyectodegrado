import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { InventarioAnimalOut } from "@/types/inventarioAnimal";
import { logoBase64 } from "../Logo";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  logo: {
    width: 64,
    height: 64,
    position: "absolute",
    right: 24,
    top: 24,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontWeight: "bold",
    fontSize: 10,
  },
  tableCell: {
    fontSize: 8,
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    color: "#666",
  },
});

export const ReporteInventarioPDF = ({
  data,
  startDate,
  endDate,
}: {
  data: InventarioAnimalOut[];
  startDate?: Date;
  endDate?: Date;
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image src={logoBase64} style={styles.logo} />
      <View style={styles.header}>
        <Text style={styles.title}>Reporte de Inventario Animal</Text>
        <Text style={styles.subtitle}>
          {startDate && `Desde: ${format(startDate, "PPP")} `}
          {endDate && `Hasta: ${format(endDate, "PPP")}`}
          {!startDate && !endDate && "Todos los registros"}
        </Text>
      </View>

      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: "5%" }]}>
            <Text style={styles.tableCellHeader}>ID</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "10%" }]}>
            <Text style={styles.tableCellHeader}>N° Trazabilidad</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "10%" }]}>
            <Text style={styles.tableCellHeader}>Nombre</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "10%" }]}>
            <Text style={styles.tableCellHeader}>Especie</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "10%" }]}>
            <Text style={styles.tableCellHeader}>Raza</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "5%" }]}>
            <Text style={styles.tableCellHeader}>Sexo</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "8%" }]}>
            <Text style={styles.tableCellHeader}>F. Ingreso</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "10%" }]}>
            <Text style={styles.tableCellHeader}>Motivo Ingreso</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "8%" }]}>
            <Text style={styles.tableCellHeader}>Precio</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "10%" }]}>
            <Text style={styles.tableCellHeader}>Ubicación</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "8%" }]}>
            <Text style={styles.tableCellHeader}>Lote</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "8%" }]}>
            <Text style={styles.tableCellHeader}>F. Egreso</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "10%" }]}>
            <Text style={styles.tableCellHeader}>Motivo Egreso</Text>
          </View>
          <View style={[styles.tableColHeader, { width: "8%" }]}>
            <Text style={styles.tableCellHeader}>Estado</Text>
          </View>
        </View>

        {/* Datos */}
        {data.map((item) => (
          <View key={item.inventario_id} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "5%" }]}>
              <Text style={styles.tableCell}>{item.animal_id}</Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>
                {item.animal.numero_trazabilidad}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>
                {item.animal.nombre_identificatorio || "-"}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>
                {item.animal.especie.nombre_comun}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>
                {item.animal.raza.nombre_raza}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "5%" }]}>
              <Text style={styles.tableCell}>{item.animal.sexo}</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text style={styles.tableCell}>
                {format(new Date(item.fecha_ingreso), "dd/MM/yy")}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>{item.motivo_ingreso}</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text style={styles.tableCell}>
                {item.precio_compra ? `$${item.precio_compra}` : "-"}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>
                {item.ubicacion_actual?.nombre || "-"}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text style={styles.tableCell}>
                {item.lote_actual?.codigo_lote || "-"}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text style={styles.tableCell}>
                {item.fecha_egreso
                  ? format(new Date(item.fecha_egreso), "dd/MM/yy")
                  : "-"}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>{item.motivo_egreso || "-"}</Text>
            </View>
            <View style={[styles.tableCol, { width: "8%" }]}>
              <Text style={styles.tableCell}>{item.animal.estado_actual}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>Total registros: {data.length}</Text>
        <Text>Generado el: {format(new Date(), "PPP")}</Text>
      </View>
    </Page>
  </Document>
);
