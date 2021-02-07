exports.seed = async function (knex) {
	await knex('users').insert([
		{
			id: 1,
			username: 'markanator',
			//bananas12!@
			password:
				'$2a$14$GpiQEHMfxhOIUSlOa9Bmu.Pp3mR93DK01VjZCQkLeQGDhwkqxKGM.',
		},
	]);
};
