const db = require("../config/db");

const getAllServices = (req, res) => {

    const sql = "SELECT * FROM services";

    db.query(sql, (error, results) => {

        if (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });

        }

        res.json(results);

    });

};

module.exports = {
    getAllServices
};