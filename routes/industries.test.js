const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { createData } = require('../_test-common');

process.env.NODE_ENV = 'test';

beforeAll(createData);

describe('GET /industries', () => {
	it('should return a 200 status code', async () => {
		const response = await request(app).get('/industries');

		expect(response.status).toBe(200);
	});
	it('should have 1 industry entry', async () => {
		const response = await request(app).get('/industries');
		console.log(response.body);

		expect(response.body.industries.length).toEqual(1);
		expect(response.body.industries[0].code).toEqual('tech');
	});

	it('should return a 200 status code', async () => {
		const response = await request(app).get('/industries/tech');
		console.log(response.body);

		expect(response.status).toBe(200);
	});
});

describe('POST /industries', () => {
	it('should return a 201 status code', async () => {
		const response = await request(app)
			.post('/industries')
			.send({ code: 'ag', name: 'Agriculture', description: 'feeding the world' });

		expect(response.status).toBe(201);
		expect(response.body.industry.code).toEqual('ag');
	});
});

afterAll(() => {
	db.end();
});
