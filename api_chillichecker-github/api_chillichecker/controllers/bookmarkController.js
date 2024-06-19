const { Storage } = require('@google-cloud/storage');
const path = require('path');
const db = require('../config/db');
require('dotenv').config();

const storage = new Storage({
    keyFilename: path.join(__dirname, '../credentials.json'),
});

const bucketName = process.env.BUCKET_NAME;

exports.bookmark = async (req, res) => {
    try {
        const { userId, idPredict, label, careInstructions, description, marketPrice, name, suitableDishes } = req.body;
        const { file } = req;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const bucket = storage.bucket(bucketName);

        const fileName = `bookmark/${userId}/bookmark_${Date.now()}.jpg`;
        const files = bucket.file(fileName);

        await files.save(file.buffer, {
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

        await db.execute('INSERT INTO bookmark VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',[userId, idPredict, label, careInstructions, description, marketPrice, name, suitableDishes, publicUrl]);

        res.status(201).send({ error: false, message: 'Bookmark saved successfully', photoUrl: publicUrl });
    } catch (err) {
        console.error('Error during file upload:', err);
        res.status(500).send({ error: true, message: 'Server error' });
    }
};

exports.bookmarkList = async (req, res) => {
    try {
        const { userId } = req.query;

        const [totalCountResult] = await db.execute('SELECT COUNT(*) as total FROM bookmark WHERE userId = ?',[userId]);
        const totalItems = totalCountResult[0].total;

        const [items] = await db.execute('SELECT idPredict, label, careInstructions, description, marketPrice, name, suitableDishes, picture FROM bookmark WHERE userId = ?',[userId]);
        const cleanedItems = items.map(item => ({
            ...item,
            picture: item.picture.trim()
        }));

        const response = {
            error: false,
            message: 'Bookmark items fetched successfully',
            totalItems: totalItems,
            items: cleanedItems,
        };

        res.status(200).json(response);
    } catch (err) {
        console.error('Error during file upload:', err);
        res.status(500).send({ error: true, message: 'Server error' });
    }
};

exports.bookmarkDelete = async (req, res) => {
    try {
        const { userId, idPredict} = req.query;

        const [rows] = await db.execute('SELECT picture FROM bookmark WHERE userId = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).send({ error: true, message: 'Bookmark not found' });
        }

        const photoUrl = rows[0].picture;
        if (!photoUrl) {
            return res.status(400).send({ error: true, message: 'no bookmark picture to delete' });
        }

        const urlParts = photoUrl.split('/');
        const folderId = urlParts[urlParts.length - 2];
        const fileName = urlParts[urlParts.length - 1];

        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`bookmark/${folderId}/${fileName}`);
        await file.delete();

        await db.execute('DELETE FROM bookmark WHERE userId = ? AND idPredict = ?',[userId, idPredict]);

        const [files] = await bucket.getFiles({ prefix: `bookmark/${folderId}/` });
        if (files.length === 0) {
            await bucket.deleteFiles({ prefix: `bookmark/${folderId}` });
        }

        const response = {
            error: false,
            message: 'Bookmark deleted successfully',
        };

        res.status(200).json(response);
    } catch (err) {
        console.error('Error during file upload:', err);
        res.status(500).send({ error: true, message: 'Server error' });
    }
};