import {
  Schema,
  ConnectionOptions
} from 'mongoose'

interface MongooseConfiguration {
  uris: string
  prefix?: string
  debug?: boolean
  connectionOptions?: ConnectionOptions
}

interface MongooseModel {
  name: string
  schema: Schema
}

export {
  MongooseConfiguration,
  MongooseModel
}