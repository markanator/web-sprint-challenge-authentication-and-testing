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
	it('GET /jokes', async () => {
		const login = await supertest(server).post('/auth/login').send({
			username: 'markanator',
			password: 'bananas12!@',
		});
		const { token } = await login.body;
		const joke = await supertest(server)
			.get('/jokes')
			.set('Authorization', token);
		expect(joke.status).toBe(200);
		expect(joke.type).toBe('application/json');
		expect(joke.body).toHaveLength(20);
	});

	it('Fails Get /jokes', async () => {
		const res = await supertest(server).get('/jokes');

		expect(res.status).toBe(401);
		expect(res.body.message).toBe('Invalid credentials');
	});
});
