import connection from "./database";

export default async function handler(req, res) {
    try {
        const dataKLHK = await fetchData(connection, 'data_biodigester_klhk');
        const dataPondokRangon = await fetchData(connection, 'pondok_rangon');
        const dataJatisari = await fetchData(connection, 'taman_jatisari');

        res.status(200).json({ "Pondok Rangon": dataPondokRangon, "Jatisari": dataJatisari, "KLHK": dataKLHK });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchData(connection, tableName) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT weight, date_created FROM ${tableName} WHERE DATE(date_created) >= DATE(DATE_SUB(CONVERT_TZ(CURDATE(), '+00:00', '+07:00'), INTERVAL 6 DAY)) order by date_created desc`,
            (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
}
