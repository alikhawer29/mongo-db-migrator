const { migrateDatabase } = require("../services/migrateService");

module.exports = async (req, res, io) => {
    try {
        await migrateDatabase({ ...req.body, io });
        res.json({ message: "Migration started" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};