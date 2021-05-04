import {
  Injectable,
  Inject
} from '@nestjs/common'
import {
  Model
} from 'mongoose'
import {
  UserActivityLogEntity
} from './user_activity_log.entity'
import {
  CreateOneData
} from './user_activity_log.interface'
import {
  USER_ACTIVITY_LOG_MODEL
} from './user_activity_log.constant'

@Injectable({})
export class UserActivityLogService {
  constructor(
    @Inject(USER_ACTIVITY_LOG_MODEL) readonly UserActivityLogModel: Model<UserActivityLogEntity>
  ) { }

  public async createOne(
    createOneData: CreateOneData
  ): Promise<UserActivityLogEntity> {
    const createData: { [key: string]: unknown } = {}

    if (createOneData.org_id !== undefined) {
      createData.org_id = +createOneData.org_id
    }

    if (createOneData.user_id !== undefined) {
      createData.user_id = +createOneData.user_id
    }

    if (createOneData.event_id !== undefined) {
      createData.event_id = +createOneData.event_id
    }

    if (createOneData.result_id !== undefined) {
      createData.result_id = +createOneData.result_id
    }

    if (createOneData.first_name !== undefined) {
      createData.first_name = createOneData.first_name?.trim()
    }

    if (createOneData.last_name !== undefined) {
      createData.last_name = createOneData.last_name?.trim()
    }

    if (createOneData.extension !== undefined) {
      createData.extension = createOneData.extension
    }

    if (createOneData.old_value !== undefined) {
      createData.old_value = typeof createOneData.old_value === 'object'
        ? JSON.stringify(createOneData.old_value)
        : createOneData.old_value
    }

    if (createOneData.new_value !== undefined) {
      createData.new_value = typeof createOneData.new_value === 'object'
        ? JSON.stringify(createOneData.new_value)
        : createOneData.new_value
    }

    const newUserActivityLog = new this.UserActivityLogModel(createData)

    return newUserActivityLog.save()
  }
}
