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

import * as actors from '../../lib/actors'
import { isHasCode } from '../../util/types'


interface ParamsId {
  id: number
}
const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

interface PayloadActor {
  name: string
  bio: string
  bornAt: Date
}
const validatePayloadActor: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string().required(),
    bio: joi.string().required(),
    bornAt: joi.date().required(),
  })
}


export const actorRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/actors',
  handler: getAll,
},{
  method: 'POST',
  path: '/actors',
  handler: post,
  options: { validate: validatePayloadActor },
},{
  method: 'GET',
  path: '/actors/{id}',
  handler: get,
  options: { validate: validateParamsId },
},{
  method: 'PUT',
  path: '/actors/{id}',
  handler: put,
  options: { validate: {...validateParamsId, ...validatePayloadActor} },
},{
  method: 'DELETE',
  path: '/actors/{id}',
  handler: remove,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actorMovies/{id}',
  handler: getActorMovies,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actorFavoriteGenre/{id}',
  handler: getActorFavoriteGenre,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actorCharacters/{id}',
  handler: getActorCharacters,
  options: { validate: validateParamsId },
},]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return actors.list()
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await actors.find(id)
  return found || Boom.notFound()
}

async function getActorMovies(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await actors.actorMovies(id)
  return found || Boom.notFound()
}

async function getActorFavoriteGenre(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await actors.actorFavoriteGenre(id)
  return found || Boom.notFound()
}

async function getActorCharacters(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await actors.actorCharacters(id)
  return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { name, bio, bornAt } = (req.payload as PayloadActor)

  try {
    const id = await actors.create(name, bio, bornAt)
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
  const { name, bio, bornAt } = (req.payload as PayloadActor)

  try {
    return await actors.update(id, name, bio, bornAt) ? h.response().code(204) : Boom.notFound()
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  return await actors.remove(id) ? h.response().code(204) : Boom.notFound()
}
