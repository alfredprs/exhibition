import connection from "./database";
import connectionKLHK from "./databaseKLHK";

export default function handler(req, res) {
    const { location } = req.query;

    if (location === "klhk") {
        connectionKLHK.query(
            `SELECT * FROM data_biodigester_klhk order by date_created desc`,
            (error, results, fields) => {
                if (error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                const adjustedResults = results.map(row => {
                    const dateCreated = new Date(row.date_created);
                    dateCreated.setHours(dateCreated.getHours() + 7);
                    row.date_created = dateCreated.toISOString();
                    return row;
                });
                res.status(200).json(adjustedResults);
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
            const adjustedResults = results.map(row => {
                const dateCreated = new Date(row.date_created);
                dateCreated.setHours(dateCreated.getHours() + 7);
                row.date_created = dateCreated.toISOString();
                return row;
            });
            res.status(200).json(adjustedResults);
        }
    );
    }
    
}