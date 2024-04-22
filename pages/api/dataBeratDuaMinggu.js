import connection from "./database";
import connectionKLHK from "./databaseKLHK";

export default async function handler(req, res) {
    try {
        const dataKLHK = await fetchData(connectionKLHK, 'data_biodigester_klhk');
        const dataPasarKoja = await fetchData(connection, 'pasar_koja_jakut');
        const dataJatisari = await fetchData(connection, 'taman_jatisari');

        res.status(200).json({ "Pasar Koja": dataPasarKoja, "Jatisari": dataJatisari, "KLHK": dataKLHK });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchData(connection, tableName) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT weight, date_created FROM ${tableName} WHERE DATE(date_created) >= DATE(DATE_SUB(CONVERT_TZ(CURDATE(), '+00:00', '+07:00'), INTERVAL 13 DAY)) order by date_created desc`,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }
                const adjustedResults = results.map(row => {
                    const dateCreated = new Date(row.date_created);
                    dateCreated.setHours(dateCreated.getHours() + 7);
                    row.date_created = dateCreated.toISOString();
                    return row;
                });
                resolve(adjustedResults);
            }
        );
    });
}
