import connection from "./database";

export default function handler(req, res) {
    const { location } = req.query;

    if (location === "klhk") {
        connection.query(
            `SELECT * FROM data_biodigester_klhk order by date_created desc`,
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
        `SELECT * FROM ${location} order by date_created desc`,
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