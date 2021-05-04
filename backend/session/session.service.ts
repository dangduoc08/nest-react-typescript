import {
  Injectable,
  Inject
} from '@nestjs/common'
import {
  Model
} from 'mongoose'
import {
  SESSION_MODEL
} from './session.constant'
import {
  SessionEntity
} from './session.entity'
import {
  SessionQueryData
} from './session.interface'

@Injectable({})
export class SessionService {
  constructor(
    @Inject(SESSION_MODEL) readonly SessionModel: Model<SessionEntity>
  ) { }

  private buildShopQueryData = (sessionQueryData: SessionQueryData): {} => {
    const queryData = {}

    if (sessionQueryData.org_id) {
      queryData['session.org_id'] = +sessionQueryData.org_id
    }
    if (sessionQueryData.sid) {
      queryData['session.sid'] = sessionQueryData.sid
    }

    return queryData
  }

  public get<T>(session: Express.Session): T {
    const clonedSession = JSON.parse(JSON.stringify(session))
    if (clonedSession.cookie) delete clonedSession.cookie
    return clonedSession
  }

  public set<T>(
    session: Express.Session,
    createData: T
  ): void {
    for (const sessionKey in createData) {
      const sessionValue = createData[sessionKey]
      session[sessionKey] = sessionValue
    }
  }

  public async deleteMany(
    sessionQueryData: SessionQueryData
  ): Promise<void> {
    const queryData = this.buildShopQueryData(sessionQueryData)

    await this.SessionModel.deleteMany({
      ...queryData
    })
    return
  }
}
