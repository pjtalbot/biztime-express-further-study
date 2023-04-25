const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { createData } = require('../_test-common');

process.env.NODE_ENV = 'test';

beforeAll(createData);

describe('GET /companies', () => {
	it('should return a 200 status code', async () => {
		const response = await request(app).get('/companies');

		expect(response.status).toBe(200);
	});
	it('should have 2 company entries', async () => {
		const response = await request(app).get('/companies');
		console.log(response.body);

		expect(response.body.companies.length).toEqual(2);
	});
});

describe('GET /companies/code', () => {
	it('should return a 200 status code', async () => {
		const response = await request(app).get('/companies/ibm');
		console.log(response);

		expect(response.status).toBe(200);
	});
	it('should have 2 company entries', async () => {
		const response = await request(app).get('/companies');
	});
});

describe('POST /companies', () => {
	it('should return a 201 statu code', async () => {
		const response = await request(app).post('/companies').send({ name: 'Google', description: 'Big Tech' });
		console.log(response.body);

		expect(response.status).toBe(201);
		expect(response.body.company.code).toEqual('google');
	});
});

describe('POST /companies/:code/join/:indCode', () => {
	it('should join industry and return a 201 status code', async () => {
		const response = await request(app).post('/companies/apple/join/tech');
		console.log(response.body);

		expect(response.status).toBe(201);
		expect(response.body.msg).toEqual('apple joined industry: tech');
	});
});

describe('PUT /companies/:code', () => {
	it('should return a 201 status code', async () => {
		const response = await request(app)
			.put('/companies/ibm')
			.send({ name: 'new name', description: 'new descriptions' });

		expect(response.status).toBe(201);
		expect(response.body.company.name).toEqual('new name');
	});
});

describe('DELETE /companies/:code', () => {
	it('should delete company', async () => {
		const response = await request(app).delete('/companies/ibm');

		expect(response.status).toEqual(200);
		expect(response.body.msg).toEqual('DELETED!');
	});
});

afterAll(() => {
	db.end();
});
