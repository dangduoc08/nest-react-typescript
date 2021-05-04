import {
  Schema
} from 'mongoose'
import {
  UserActivityLogEvent,
  UserActivityLogResult
} from './user_activity_log.enum'
import {
  COLLECTION_TTL
} from './user_activity_log.constant'

export const UserActivityLogSchema = new Schema(
  {
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    org_id: {
      type: Number
    },
    event_id: {
      type: UserActivityLogEvent,
      default: 0
    },
    result_id: {
      type: UserActivityLogResult,
      default: 0
    },
    user_id: {
      type: Number
    },
    extension: {
      type: Schema.Types.Mixed
    },
    old_value: {
      type: Schema.Types.Mixed
    },
    new_value: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: {
      createdAt: 'doc_created_at',
      updatedAt: 'doc_updated_at'
    }
  }
)

UserActivityLogSchema.index(
  {
    doc_created_at: 1
  },
  {
    expireAfterSeconds: COLLECTION_TTL
  }
)