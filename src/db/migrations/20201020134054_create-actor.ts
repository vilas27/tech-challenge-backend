import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE actor(
      id      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name    VARCHAR(50) NOT NULL,
      bio     VARCHAR(150),
      bornAt  DATE NOT NULL,

      CONSTRAINT PK_actor__id PRIMARY KEY(id),
      CONSTRAINT UK_actor__name_bornAt UNIQUE KEY(name, bornAt)
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE actor;')
}

