import connection from "./database";
import connectionKLHK from "./databaseKLHK";

export default function handler(req, res) {
    const { location } = req.query;

    if (location === "klhk") {
        connectionKLHK.query(
            `SELECT count(gas_prod) as total FROM data_biodigester_klhk`,
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
            `SELECT count(gas_prod) as total FROM ${location}`,
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