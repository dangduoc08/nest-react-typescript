import Timeline from '@material-ui/icons/Timeline'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import {
  CONTAINER
} from '@commons/constants'
import {
  Nav
} from '@commons/interfaces'

export const appNav: Nav[] = [
  {
    to: CONTAINER.DASHBOARD.PATH,
    title: CONTAINER.DASHBOARD.NAME,
    icon: Timeline
  },
  {
    header: 'integratedChannels',
    expand: true,
    children: [
      {
        to: CONTAINER.TIKI.PATH,
        title: CONTAINER.TIKI.NAME,
        icon: FiberManualRecordIcon
      },
      {
        to: CONTAINER.SHOPEE.PATH,
        title: CONTAINER.SHOPEE.NAME,
        icon: FiberManualRecordIcon
      },
      {
        to: CONTAINER.LAZADA.PATH,
        title: CONTAINER.LAZADA.NAME,
        icon: FiberManualRecordIcon
      }
    ]
  }
]