import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import DehazeIcon from '@material-ui/icons/Dehaze'
import Drawer from '@material-ui/core/Drawer'
import {
  Link as RouterLink
} from 'react-router-dom'
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles'
import RightHeader from './right_header.component'
import Navigator from './navigator.component'
interface HeaderProps {
  shop: {
    logoutURL: string
    shopName: string
    appName: string
    logo: string
  }
  user: {
    firstName: string
    lastName: string
  }
}

const useCommonStyles = makeStyles((theme: Theme) => {
  const {
    palette,
    spacing
  } = theme

  return createStyles({
    routerLink: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'none'
    },
    'btn-info': {
      boxShadow: 'none',
      padding: 0
    },
    'icon-expand': {
      marginLeft: spacing(2),
      color: palette.grey[400]
    },
    btnDrawer: {
      minWidth: '0px'
    }
  })
})

const useAppBarStyles = makeStyles((theme: Theme) => {
  const {
    zIndex
  } = theme

  return ({
    root: {
      zIndex: zIndex.drawer + 1
    }
  })
})

const useToolbarStyles = makeStyles(() => ({
  root: {
    justifyContent: 'space-between',
    minHeight: '56px',
    boxShadow: '0 2px 2px -1px',
    padding: '0 10px',
    position: 'relative'
  }
}))

const useLogoStyles = makeStyles((theme: Theme) => {
  const {
    spacing
  } = theme

  return ({
    root: {
      marginRight: spacing(2),
      width: '32px',
      height: '32px'
    },
    img: {
      objectFit: 'contain'
    }
  })
})

const useAppName = makeStyles((theme: Theme) => {
  const {
    palette,
    typography
  } = theme

  return ({
    button: {
      color: palette.grey[50],
      fontWeight: typography.fontWeightBold,
      textDecoration: 'none'
    }
  })
})


function Header(props: HeaderProps) {
  const commonStyles = useCommonStyles()
  const appBarStyles = useAppBarStyles()
  const toolbarStyles = useToolbarStyles()
  const logoStyles = useLogoStyles()
  const appNameStyles = useAppName()
  const [isDrawer, setIsDrawer] = React.useState(false)

  const {
    shop,
    user
  } = props

  const handleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setIsDrawer(open)
  }

  return (
    <AppBar
      position='fixed'
      elevation={0}
      classes={{
        ...appBarStyles
      }}
    >
      <Toolbar
        classes={{
          ...toolbarStyles
        }}
      >

        <Hidden only={['xs']}>
          <Box component='div'>
            <RouterLink
              to='/'
              className={commonStyles.routerLink}
            >
              <Avatar
                src={shop.logo}
                variant='square'
                classes={{
                  ...logoStyles
                }}
              />
              <Typography
                variant='button'
                classes={{
                  ...appNameStyles
                }}
              >
                {shop?.appName}
              </Typography>
            </RouterLink>
          </Box>
        </Hidden>

        <Hidden only={['xl', 'lg', 'md', 'sm']}>
          <React.Fragment key={'left'}>
            <Button
              className={commonStyles.btnDrawer}
              onClick={handleDrawer(true)}
            >
              <DehazeIcon style={{ color: '#fff' }} />
            </Button>
            <Drawer
              anchor={'left'}
              open={isDrawer}
              onClose={handleDrawer(false)}
            >
              <Navigator
                isDrawer={isDrawer}
              />
            </Drawer>
          </React.Fragment>
        </Hidden>

        <RightHeader
          user={user}
          shop={shop}
        />

      </Toolbar>
    </AppBar>
  )
}

export default Header