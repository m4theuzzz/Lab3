import transitions from '@material-ui/core/styles/transitions'
import { lightBlue } from '@mui/material/colors'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
})
const PdfRender = ({ transactions }: any) => {

    const name = window.localStorage.getItem("name")

    console.log(name)
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ ...styles.section }}>
                    <Text style={{ color: 'lightblue', fontSize: 32, marginBottom: 10 }}>Relatório de Transações</Text>
                    <Text style={{ marginBottom: 20, fontSize: 25 }}>{name}</Text>
                    {transactions.map((transaction: any) => <Text style={{ marginBottom: 10 }}> - {transaction.description} | para {transaction.name} | {transaction.value} moedas</Text>)}
                </View>

            </Page>
        </Document>
    )

}

export default PdfRender