import {
  Injectable,
  Inject
} from '@nestjs/common'
import {
  Model
} from 'mongoose'
import {
  UserEntity
} from './user.entity'
import {
  UserQuery,
  UserData
} from './user.interface'
import {
  USER_MODEL
} from './user.constant'
import {
  UserStatus
} from './user.enum'

@Injectable({})
export class UserService {
  constructor(
    @Inject(USER_MODEL) readonly UserModel: Model<UserEntity>
  ) { }
  public async upsertOne(
    userQuery: UserQuery,
    userData: UserData
  ): Promise<UserEntity | null> {
    const queryData: Record<string, unknown> = {}
    if (userQuery._id !== undefined) {
      queryData['_id'] = +userQuery._id
    }

    const updateData: Record<string, unknown> = {
      'extension.status': UserStatus.Active
    }
    if (userData.org_id !== undefined) {
      updateData['org_id'] = +userData?.org_id
    }

    if (userData.email !== undefined) {
      updateData['email'] = userData?.email?.trim()
    }

    if (userData.first_name !== undefined) {
      updateData['first_name'] = userData?.first_name?.trim()
    }

    if (userData.last_name !== undefined) {
      updateData['last_name'] = userData?.last_name?.trim()
    }

    if (userData.bio !== undefined) {
      updateData['bio'] = userData?.bio?.trim()
    }

    if (userData.phone !== undefined) {
      updateData['phone'] = userData?.phone?.trim()
    }

    if (userData.account_owner !== undefined) {
      updateData['account_owner'] = userData?.account_owner ?? false
    }

    if (userData.user_type !== undefined) {
      updateData['user_type'] = userData?.user_type?.trim()
    }

    if (userData.receive_announcements !== undefined) {
      updateData['receive_announcements'] = +userData?.receive_announcements
    }

    if (userData.url !== undefined) {
      updateData['url'] = userData?.url?.trim()
    }

    if (userData.im !== undefined) {
      updateData['im'] = userData?.im?.trim()
    }

    if (userData.permissions !== undefined) {
      updateData['permissions'] = userData?.permissions
    }

    return await this.UserModel.findOneAndUpdate(
      {
        ...queryData
      },
      {
        ...updateData
      },
      {
        upsert: true,
        new: true
      }
    )
  }

  public async deleteOne(
    userQuery: UserQuery
  ): Promise<UserEntity | null> {
    const queryData: Record<string, unknown> = {}
    if (userQuery._id !== undefined) {
      queryData['_id'] = +userQuery._id
    }

    return await this.UserModel.findOneAndUpdate(
      {
        ...queryData
      },
      {
        $set: {
          'extension.status': UserStatus.Deactive
        }
      },
      {
        new: true
      }
    )
  }
}
