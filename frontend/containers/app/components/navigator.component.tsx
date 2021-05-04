import * as React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import {
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles'
import {
  Nav
} from '@commons/interfaces'
import {
  NavLink
} from 'react-router-dom'
import {
  useTranslation
} from 'react-i18next'
import {
  appNav
} from '../app.nav'

interface ListItemWrapperProps {
  to?: string
  hasSubMenu?: boolean
  isExpandMenu?: boolean
  className?: string
  onClick?: React.EventHandler<React.MouseEvent>
  children?: React.ReactNode
}

interface Navigator {
  isDrawer?: boolean
}


const useStyles = makeStyles((theme: Theme) => {
  const {
    spacing,
    typography
  } = theme

  return ({
    drawer: {
      padding: 0,
      width: 240,
      flexShrink: 0
    },
    drawerPaper: {
      paddingTop: '56px',
      width: 240
    },
    drawerPaper_2: {
      top: '0px',
      width: 240
    },
    listRoot: {
      width: '100%'
    },
    listItemRoot: {
      margin: '2px 0 0',
      padding: '0',
      '& #collapsible': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '2px 7px 0 8px',
        padding: '0 0 0 2px',
        '&:hover': {
          backgroundColor: '#f3f3f3',
          borderRadius: 5
        }
      },
      '& a': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textDecoration: 'none',
        '& span': {
          fontSize: typography.fontSize,
          fontWeight: typography.fontWeightMedium
        },
        '& .MuiBox-root #conten_nav': {
          margin: '0 7px',
          '&:hover': {
            backgroundColor: '#f3f3f3',
            borderRadius: 5
          }
        }
      },
      '& a.active .MuiBox-root #conten_nav': {
        color: '#00E5FF ',
        backgroundColor: '#eaeaea',
        borderRadius: 5
      },
      '& a.active #dot': {
        /* Animation */
        transition: 'transform .2s',
        transform: 'scale(1.5)',

        backgroundColor: '#00E5FF',
        height: '65%',
        width: theme.spacing(0.3),
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
      },
      '& a:not(.active) #dot': {
        backgroundColor: 'transparent',
        height: '80%',
        width: theme.spacing(0.3),
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
      }
    },
    listItemIconRoot: {
      minWidth: spacing(4)
    },
    listItemWrapper: {
      textDecoration: 'none',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      color: '#202223',
      height: 30,
      marginTop: 2,
      fontWeight: typography.fontWeightMedium,
      fontSize: typography.fontSize
    }
  })
})

const GreyTypography = withStyles({
  root: {
    color: '#6D7175'
  }
})(Typography)

const ListItemWrapper = (
  {
    children,
    to,
    hasSubMenu,
    className,
    onClick,
    isExpandMenu
  }: ListItemWrapperProps) => {
  if (to && !hasSubMenu) {
    return (
      <NavLink
        to={to}>
        <Box className={className} >
          <Box
            component='div'
            id="dot" />

          <Box
            id="conten_nav"
            className={className}
          >
            {children}
          </Box>
        </Box>
      </NavLink>
    )
  }
  return (
    <Box
      id="collapsible"
      onClick={onClick}
      style={{ cursor: isExpandMenu ? 'pointer' : 'unset' }} >
      {children}
    </Box>
  )
}

const renderAppNavigator = (nav: Nav) => {
  const {
    t: trans
  } = useTranslation('navigator')
  const classes = useStyles()

  const {
    title,
    to,
    children,
    expand,
    header,
    icon: Icon
  } = nav

  const [isExpand, setExpand] = React.useState(expand)
  const hasSubMenu: boolean = !!children && children?.length > 0 && !to
  const isExpandMenu: boolean = typeof expand === 'boolean' && hasSubMenu
  const isSubTitle: boolean = typeof expand !== 'boolean' && hasSubMenu
  const translatedText: string = title ? trans(title) : header ? trans(header) : ''

  return (
    <React.Fragment key={translatedText}>
      <Box component='div'
        display="flex">
        {
          title ?
            <ListItem
              classes={{
                root: classes.listItemRoot
              }}
            >
              <ListItemWrapper
                to={to}
                hasSubMenu={hasSubMenu}
                isExpandMenu={isExpandMenu}
                className={classes.listItemWrapper}
                onClick={() => setExpand(!isExpand)}
              >

                {
                  Icon
                    ? <ListItemIcon
                      classes={{
                        root: classes.listItemIconRoot
                      }}>
                      <Icon />
                    </ListItemIcon>
                    : null
                }

                {
                  isSubTitle ?
                    <Typography>{translatedText}</Typography>
                    :
                    <React.Fragment>
                      <ListItemText primary={translatedText} />
                      {
                        isExpandMenu ?
                          isExpand ?
                            <ExpandLess /> :
                            <ExpandMore /> : null
                      }
                    </React.Fragment>
                }
              </ListItemWrapper>
            </ListItem>
            :
            <Box
              style={{
                paddingLeft: 10,
                marginBottom: 5,
                marginTop: 5
              }}
              component='div'
            >
              {
                Icon
                  ? <ListItemIcon
                    classes={{
                      root: classes.listItemIconRoot
                    }}>
                    <Icon />
                  </ListItemIcon>
                  : null
              }
              <GreyTypography>{translatedText}</GreyTypography>
            </Box>

        }
      </Box>

      {
        hasSubMenu &&
          isExpandMenu ?
          <Collapse in={isExpand} timeout="auto" unmountOnExit>
            {children?.map(renderAppNavigator)}
          </Collapse>
          :
          children?.map(renderAppNavigator)
      }


    </React.Fragment>
  )
}

const Navigator = (props: Navigator) => {

  const {
    isDrawer
  } = props

  const {
    t: trans
  } = useTranslation('navigator')

  const classes = useStyles()

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: isDrawer ? classes.drawerPaper_2 : classes.drawerPaper
      }}
    >
      <Box
        component='div'
        display='flex'
        justifyContent='space-between'
        flexDirection='column'
        height='100%'
      >
        <List
          classes={{
            root: classes.listRoot
          }} >

          {appNav.map(renderAppNavigator)}
        </List>

        <List
          classes={{
            root: classes.listRoot
          }}
        >
          <ListItem
            classes={{
              root: classes.listItemRoot
            }}
          >
            <NavLink
              to='/settings'>
              <Box className={classes.listItemWrapper}>
                <Box
                  component='div'
                  id="dot" />
                <Box
                  id="conten_nav"
                  className={classes.listItemWrapper}>
                  <ListItemText
                    primary={trans('settings')}
                  />
                </Box>
              </Box>
            </NavLink>
          </ListItem>
        </List>
      </Box>
    </Drawer >
  )
}

export default Navigator