const db = require('../config/db');
const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

exports.postScanHandler = async (req, res, next) => {
    try {
        const { file } = req;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const model = req.app.get('model');
        const { confidenceScore, label, id } = await predictClassification(model, file.buffer);

        const [user] = await db.execute('SELECT * FROM chilli WHERE id = ?', [id]);
        const idPredict = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id: idPredict,
            createdAt: createdAt,
            label: label,
            careInstructions: user[0].careInstructions,
            description: user[0].description,
            marketPrice: user[0].marketPrice,
            name: user[0].name,
            suitableDishes: user[0].suitableDishes
        };

        return res.status(201).json({
            status: 'success',
            message: confidenceScore > 60 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
            data
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}