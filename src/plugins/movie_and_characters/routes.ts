import {
  ServerRoute,
  ResponseToolkit,
  Lifecycle,
  RouteOptionsValidate,
  Request,
  RouteOptionsResponseSchema
} from '@hapi/hapi'
import joi from 'joi'
import Boom from '@hapi/boom'

import * as movie_and_characters from '../../lib/movie_and_characters'
import { isHasCode } from '../../util/types'

import { Movie } from '../../lib/movies'
import { Character } from '../../lib/characters'

interface ParamsId {
  id: number
}
const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

interface PayloadMovieAndCharacters {
  movie: Movie
  characters: Character[]
}

const validatePayloadMovieAndCharacters: RouteOptionsResponseSchema = {
  payload: joi.object({
    movie: joi.object().required(),
    characters: joi.array().required(),
  })
}

export const movieAndCharactersRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/movieAndCharacters',
  handler: getAll,
},{
  method: 'POST',
  path: '/movieAndCharacters',
  handler: post,
  options: { validate: validatePayloadMovieAndCharacters },
},{
  method: 'GET',
  path: '/movieAndCharacters/{id}',
  handler: get,
  options: { validate: validateParamsId },
},{
  method: 'PUT',
  path: '/movieAndCharacters',
  handler: put,
  options: { validate: validatePayloadMovieAndCharacters },
},{
  method: 'DELETE',
  path: '/movieAndCharacters/{id}',
  handler: remove,
  options: { validate: validateParamsId },
},]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return movie_and_characters.list()
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await movie_and_characters.find(id)
  return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const input = (req.payload as PayloadMovieAndCharacters)

  try {
    const id = await movie_and_characters.create(input)
    const result = {
      id,
      path: `${req.route.path}/${id}`
    }
    return h.response(result).code(201)
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}

async function put(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const input = (req.payload as PayloadMovieAndCharacters)

  try {
    return await movie_and_characters.update(input) ? h.response().code(204) : Boom.notFound()
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  return await movie_and_characters.remove(id) ? h.response().code(204) : Boom.notFound()
}
