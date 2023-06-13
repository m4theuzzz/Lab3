import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
  },
  section: {
    margin: 10,
    padding: 30,
    flexGrow: 1,
  },
});
const PdfRender = ({ transactions }: any) => {
  const name = window.localStorage.getItem("name");

  console.log(transactions);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.section }}>
          <Text
            style={{
              color: "#1976D2",
              fontSize: 32,
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            Relatório de Transações
          </Text>
          <Text style={{ marginBottom: 5, fontSize: 25 }}>{name}</Text>
          <Text style={{ marginBottom: 30, fontSize: 14, fontStyle: "italic" }}>
            {getDataHoraAtual()}
          </Text>

          {transactions.map((transaction: any) => (
            <>
              <Text style={{ fontSize: 15, marginBottom: 5 }}>
                • {transaction.description}
              </Text>

              <Text style={{ marginBottom: 10, fontSize: 12, marginLeft: 8 }}>
                {transaction.type !== "benefit"
                  ? " para " + transaction.name
                  : ""}{" "}
                | {transaction.value} moedas
              </Text>
            </>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PdfRender;

function getDataHoraAtual() {
  var dataAtual = new Date();

  // Obtém os componentes de data e hora atual
  var dia = dataAtual.getDate();
  var mes = dataAtual.getMonth() + 1; // Os meses são indexados a partir de 0
  var ano = dataAtual.getFullYear();
  var hora = dataAtual.getHours();
  var minutos = dataAtual.getMinutes();

  // Formata os componentes para o formato desejado
  var dataFormatada = padZero(dia) + "/" + padZero(mes) + "/" + ano;
  var horaFormatada = padZero(hora) + ":" + padZero(minutos);

  // Retorna a string completa formatada
  return "Emitido às " + horaFormatada + " do dia " + dataFormatada;
}

// Função auxiliar para adicionar um zero à esquerda se o número for menor que 10
function padZero(numero) {
  return numero < 10 ? "0" + numero : numero;
}
