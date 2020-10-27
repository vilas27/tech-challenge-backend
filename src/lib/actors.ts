import { knex } from '../util/knex'
import { Movie } from './movies'

export interface Actor {
  id: number
  name: string
  bio: string
  bornAt: Date
}

/** @returns list of actors */
export function list(): Promise<Actor[]> {
  return knex.from('actor').select()
}

/** @returns actor with a specific ID */
export function find(id: number): Promise<Actor> {
  return knex.from('actor').where({ id }).first()
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('actor').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string, bio: string, bornAt: Date): Promise<number> {
  const [ id ] = await (knex.into('actor').insert({ name, bio, bornAt }))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string, bio: string, bornAt: Date): Promise<boolean>  {
  const count = await knex.from('actor').where({ id }).update({ name, bio, bornAt })
  return count > 0
}

/** @returns List of movies for a specific actor */
export async function actorMovies(actorId: number): Promise<Movie[]> {
  return knex.table('movie'
  ).select('movie.name', 'movie.synopsis', 'movie.releasedAt', 'movie.runtime'
  ).innerJoin('movie_character', 'movie.id', 'movie_character.movieId'
  ).where('movie_character.actorId', actorId)
}

/** @returns actor favorite genre */
export function  actorFavoriteGenre(actorId: number): Promise<any[]> {
  return knex
  .select('genre.name')
  .count('genre.name as genreCount')
  .from('genre')
  .innerJoin('movie', 'genre.id','movie.genreId')
  .innerJoin('movie_character', 'movie.id', 'movie_character.movieId')
  .where('movie_character.actorId', actorId)
  .groupBy('genre.name')
  .orderBy('genreCount', 'desc')
  .limit(1)
}

/** @returns characters names for a specific actor */
export function actorCharacters(actorId: number): Promise<any[]> {
  return knex.from('movie_character').select('movie_character.name').where('movie_character.actorId', actorId)
}
