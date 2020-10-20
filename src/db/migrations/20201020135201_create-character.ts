import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE movie_character (
      id        INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name      VARCHAR(50) NOT NULL,
      movieId   INT(10) UNSIGNED NOT NULL,
      actorId   INT(10) UNSIGNED NOT NULL,

      CONSTRAINT PK_movie_character__id PRIMARY KEY (id),
      CONSTRAINT UK_movie_character UNIQUE KEY (name, actorId, movieId),
      FOREIGN KEY (actorId) REFERENCES actor(id),
      FOREIGN KEY (movieId) REFERENCES movie(id)
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE characters;')
}

