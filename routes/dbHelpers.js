const db = require('../db');
const getIndustries = async (companyId) => {
	let results = await db.query(
		`SELECT industries.name FROM industries
    LEFT JOIN companies_industries ON companies.code =
    companies_industries.company_id
    WHERE companies_industries.company_id = $1`,
		[ companyId ]
	);

	return results.rows;
};

module.exports = { getIndustries };
