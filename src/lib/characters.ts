import { knex } from '../util/knex'

export interface Character {
  id: number
  name: string
  movieId: number
  actorId:number
}


export function list(): Promise<Character[]> {
  return knex.from('movie_character').select()
}

export function find(id: number): Promise<Character[]> {
  return knex.from('movie_character').where({ id }).first()
}

export function findByMovieId(movieId: number): Promise<Character[]> {
  return knex.from('movie_character').where({ movieId })
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('movie_character').where({ id }).delete()
  return count > 0
}

/** @returns whether the movieId was actually found */
export async function removeByMovieId(movieId: number): Promise<boolean> {
  const count = await knex.from('movie_character').where({ movieId }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string, movieId: number, actorId: number): Promise<number> {
  const [ id ] = await (knex.into('movie_character').insert({ name, movieId, actorId }))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string, movieId: number, actorId: number): Promise<boolean>  {
  const count = await knex.from('movie_character').where({ id }).update({ name, movieId, actorId})
  return count > 0
}

