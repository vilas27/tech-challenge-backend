import * as movies from './movies'
import * as characters from './characters'

export interface MovieAndCharacters {
  movie: movies.Movie
  characters: characters.Character[]
}

export async function list(): Promise<MovieAndCharacters[]> {
  const movies_and_characters = []
  for (const movie of await movies.list()) {
    const characters_in = await characters.findByMovieId(movie.id)
    movies_and_characters.push({'movie': movie, 'characters': characters_in})
  }
  return movies_and_characters
}

export async function find(id: number): Promise<MovieAndCharacters> {
  const movie = await movies.find(id)
  const characters_in = await characters.findByMovieId(id)
  return { 'movie': movie, 'characters': characters_in }
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  let count = await characters.removeByMovieId(id)
  if (count == true) {
    count = await movies.remove(id)
  }
  return count
}

/** @returns the ID that was created */
export async function create(data: MovieAndCharacters): Promise<number> {
  const id = await movies.create(data.movie.name, data.movie.releasedAt, data.movie.runtime, data.movie.genreId, data.movie.synopsis)
  for (const character of data.characters) {
    await characters.create(character.name, id, character.actorId)
  }
  return id
}

/** @returns whether the ID was actually found */
export async function update(data: MovieAndCharacters): Promise<boolean> {
  const result = await movies.update(data.movie.id, data.movie.name, data.movie.releasedAt, data.movie.runtime, data.movie.genreId, data.movie.synopsis)
  if (result == true) {
    for (const character of data.characters) {
      const character_result = await characters.update(character.id, character.name, character.movieId, character.actorId)
      if (character_result == false) {
        return false
      }
    }
  }
  return result
}

