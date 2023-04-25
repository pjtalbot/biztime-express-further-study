const express = require('express');
const ExpressError = require('../expressError');
let router = express.Router();
const db = require('../db');
const slugify = require('slugify');

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT * FROM industries`);
		// debugger;
		return res.json({ industries: results.rows });
	} catch (e) {
		return next(e);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { code, name, desc } = req.body;
		const results = await db.query(
			`INSERT INTO industries
        (code, name, description)
        VALUES ($1, $2, $3)
        RETURNING code, name, description`,
			[ code, name, desc ]
		);

		return res.status(201).json({ industry: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		let indId = req.params.id;
		console.log(indId);
		const results = await db.query(`SELECT * FROM industries WHERE code = $1`, [ indId ]);

		console.log(results);

		if (results.rows.length === 0) {
			return res.status(404).json({ msg: 'Industry code not found.' });
		}

		return res.status(200).json({ industry: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
