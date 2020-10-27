import { knex } from '../util/knex'

export interface Movie {
  id: number
  name: string
  synopsis?: string
  releasedAt: Date
  runtime: number
  genreId: number
}

/** @returns list of movies */
export function list(): Promise<Movie[]> {
  return knex.from('movie').select()
}

/** @returns movie with a specific ID */
export function find(id: number): Promise<Movie> {
  return knex.from('movie').where({ id }).first()
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('movie').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string, releasedAt: Date, runtime: number, genreId: number, synopsis?: string): Promise<number> {
  const [id] = await (knex.into('movie').insert({ name, synopsis, releasedAt, runtime, genreId }))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string, releasedAt: Date, runtime: number, genreId: number, synopsis?: string): Promise<boolean> {
  const count = await knex.from('movie').where({ id }).update({ name, synopsis, releasedAt, runtime, genreId })
  return count > 0
}
