const supertest = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

beforeEach(async () => {
	// reset the db before each test to start fresh
	await db.seed.run();
});

afterAll(async () => {
	// close databse connection after tests are completed
	await db.destroy();
});

describe('AUTH migration tests', () => {
	it('POST /auth/register', async () => {
		const res = await supertest(server).post('/auth/register').send({
			username: 'markanator13',
			password: 'bananas12!@',
		});
		expect(res.status).toBe(201);
		expect(res.type).toBe('application/json');
		expect(res.body.newUser.username).toBe('markanator13');
	});

	it('FAILS POST /register', async () => {
		const res = await supertest(server).post('/auth/register').send({
			username: 'markanator13',
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('Missing Required Content');
	});

	it('POST /auth/login', async () => {
		const res = await supertest(server).post('/auth/login').send({
			username: 'markanator',
			password: 'bananas12!@',
		});

		expect(res.status).toBe(200);
		expect(res.type).toBe('application/json');
		expect(res.body.message).toBeTruthy();
	});

	it('FAILS, POST /login', async () => {
		const res = await supertest(server).post('/auth/login').send({
			username: 'testuser123',
			password: 'bananas12',
		});
		// console.log(res.body);
		expect(res.status).toBe(401);
		expect(res.body.message).toBe('Invalid Credentials');
	});
});
