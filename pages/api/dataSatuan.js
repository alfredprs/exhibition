import connection from "./database";

export default function handler(req, res) {
    const { location } = req.query;

    if (location === "klhk") {
        connection.query(
            `SELECT * FROM data_biodigester_klhk WHERE DATE(date_created) >= DATE(DATE_SUB(CONVERT_TZ(CURDATE(), '+00:00', '+07:00'), INTERVAL 1 DAY)) order by date_created desc`,
            (error, results, fields) => {
                if (error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                res.status(200).json(results);
            }
        );
    } else {
        connection.query(
            `SELECT * FROM ${location} WHERE DATE(date_created) >= DATE(DATE_SUB(CONVERT_TZ(CURDATE(), '+00:00', '+07:00'), INTERVAL 1 DAY)) order by date_created desc`,
            (error, results, fields) => {
                if (error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                res.status(200).json(results);
            }
        );
    }
}