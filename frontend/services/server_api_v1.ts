import {
  Fetch
} from '@utils'

export const serverAPIV1: Fetch = new Fetch('/api/v1',
  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  }
)