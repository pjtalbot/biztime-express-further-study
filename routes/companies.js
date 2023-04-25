const express = require('express');
const ExpressError = require('../expressError');
let router = express.Router();
const db = require('../db');
const slugify = require('slugify');
const { getCompanies, getIndustries } = require('./dbHelpers');

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT * FROM companies`);
		// debugger;
		return res.json({ companies: results.rows });
	} catch (e) {
		return next(e);
	}
});

router.get('/:code', async (req, res, next) => {
	try {
		// add 404 if not found
		const code = req.params.code;
		const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [ code ]);

		const industryResults = await db.query(
			`SELECT industry_code FROM companies_industries 
    WHERE company_code = $1`,
			[ code ]
		);

		console.log(industryResults.rows);

		// const industries = await getIndustries(code);
		// console.log(industries);
		// debugger;
		return res.json({ company: results.rows });
	} catch (e) {
		return next(e);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { name, description } = req.body;
		let code = slugify(name, { lower: true });
		const results = await db.query(
			'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
			[ code, name, description ]
		);
		return res.status(201).json({ company: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.post('/:code/join/:industryCode', async (req, res, next) => {
	try {
		const indId = req.params.industryCode;
		const coCode = req.params.code;

		const results = await db.query(
			`INSERT INTO companies_industries
      (company_code, industry_code)
      VALUES ($1, $2)`,
			[ coCode, indId ]
		);

		return res.status(201).json({ msg: `${coCode} joined industry: ${indId}` });
	} catch (e) {
		return next(e);
	}
});

router.put('/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const { name, description } = req.body;
		const results = await db.query(
			'UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description',
			[ name, description, code ]
		);
		return res.status(201).json({ company: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.delete('/:code', async (req, res, next) => {
	try {
		const code = req.params.code;
		const results = await db.query(
			`DELETE FROM companies WHERE code = $1
    RETURNING code`,
			[ code ]
		);
		if (results.rows.length === 0) {
			throw new ExpressError(`Could Not Find company with code of: ${code}`, 404);
		}
		return res.send({ msg: 'DELETED!' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
