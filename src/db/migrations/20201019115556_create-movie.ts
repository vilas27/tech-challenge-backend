import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE movie (
      id          INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name        VARCHAR(50) NOT NULL,
      synopsis    VARCHAR(150),
      releasedAt  DATE NOT NULL,
      runtime     INT(4) UNSIGNED NOT NULL,
      genreId     INT(10) UNSIGNED NOT NULL,

      CONSTRAINT PK_movie__id PRIMARY KEY (id),
      CONSTRAINT UK_movie__name_releasedAt UNIQUE KEY (name, releasedAt),
      FOREIGN KEY (genreId) REFERENCES genre(id)
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE movie;')
}

