import * as React from 'react'
import {
  useSelector
} from 'react-redux'
import {
  useTranslation
} from 'react-i18next'
import {
  useSnackbar
} from 'notistack'
import {
  RootState
} from '@commons/interfaces'

function Notification() {
  const notification = useSelector((state: RootState) => state.app.notification)
  const { enqueueSnackbar } = useSnackbar()
  const { t: trans } = useTranslation('notification')

  React.useEffect(() => {
    const message = notification.message || notification.options?.variant
    if (message) {
      enqueueSnackbar(
        trans(message),
        notification.options
      )
    }
  }, [notification, enqueueSnackbar, trans])

  return null
}
export default Notification
