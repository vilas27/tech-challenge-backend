import { Plugin } from '@hapi/hapi'
import { health } from './health'
import { genre } from './genres'
import { actor } from './actors'
import { movie } from './movies'
import { character } from './characters'

export const plugins: Plugin<void>[] =
[
  health,
  genre,
  actor,
  movie,
  character,
]
