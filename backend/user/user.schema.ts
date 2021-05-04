import {
  Schema
} from 'mongoose'
import {
  UserStatus
} from './user.enum'

export const UserSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    org_id: {
      type: Number,
      required: true
    },
    bio: {
      type: String
    },
    email: {
      type: String
    },
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    phone: {
      type: String
    },
    account_owner: {
      type: Boolean
    },
    user_type: {
      type: String
    },
    receive_announcements: {
      type: Number
    },
    url: {
      type: String
    },
    im: {
      type: String
    },
    extension: {
      status: {
        type: UserStatus,
        default: UserStatus.Active
      },
    },
    permissions: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'doc_created_at',
      updatedAt: 'doc_updated_at'
    }
  }
)