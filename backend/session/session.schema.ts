import {
  Schema
} from 'mongoose'

export const SessionSchema = new Schema(
  {
    expires: {
      type: Date
    },
    session: {
      org_id: {
        type: Number
      },
      user_id: {
        type: Number
      },
      sid: {
        type: String
      },
      access_token: {
        type: String
      },
      expires_at: {
        type: Date
      },
      role: [
        {
          type: String
        }
      ],
      user_extension: {
        first_name: {
          type: String
        },
        last_name: {
          type: String
        }
      },
      shop_extension: {
        name: {
          type: String
        },
        myharavan_domain: {
          type: String
        }
      },
      extension: {
        haravan_access_token_v2: {
          type: String
        },
        app_permissions: [
          {
            type: String
          }
        ]
      }
    }
  }
)
