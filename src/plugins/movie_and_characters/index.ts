import { Server, Plugin } from '@hapi/hapi'
import { movieAndCharactersRoutes } from './routes'

export const movie_and_characters: Plugin<void> = {
  name: 'movie_and_characters',
  version: '1.0.0',
  multiple: false,
  register: (server: Server, _options: void) => server.route(movieAndCharactersRoutes)
}
