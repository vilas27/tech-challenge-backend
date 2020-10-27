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

import * as characters from '../../lib/characters'
import { isHasCode } from '../../util/types'


interface ParamsId {
  id: number
}
const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

interface PayloadCharacter {
  name: string
  movieId: number
  actorId: number
}
const validatePayloadCharacter: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string().required(),
    movieId: joi.number().required(),
    actorId: joi.number().required(),
  })
}


export const characterRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/characters',
  handler: getAll,
},{
  method: 'POST',
  path: '/characters',
  handler: post,
  options: { validate: validatePayloadCharacter },
},{
  method: 'GET',
  path: '/characters/{id}',
  handler: get,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/charactersByMovieId/{id}',
  handler: getCharacterByMovieId,
  options: { validate: validateParamsId },
},{
  method: 'PUT',
  path: '/characters/{id}',
  handler: put,
  options: { validate: {...validateParamsId, ...validatePayloadCharacter} },
},{
  method: 'DELETE',
  path: '/characters/{id}',
  handler: remove,
  options: { validate: validateParamsId },
},]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return characters.list()
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await characters.find(id)
  return found || Boom.notFound()
}

async function getCharacterByMovieId(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await characters.findByMovieId(id)
  return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { name, movieId, actorId } = (req.payload as PayloadCharacter)

  try {
    const id = await characters.create(name, movieId, actorId)
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
  const { id } = (req.params as ParamsId)
  const { name, movieId, actorId } = (req.payload as PayloadCharacter)

  try {
    return await characters.update(id, name, movieId, actorId) ? h.response().code(204) : Boom.notFound()
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  return await characters.remove(id) ? h.response().code(204) : Boom.notFound()
}
