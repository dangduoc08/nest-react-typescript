import * as React from 'react'
import {
  useRef,
  useState,
  Fragment
} from 'react'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuList from '@material-ui/core/MenuList'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import {
  useTranslation
} from 'react-i18next'
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles'
import {
  LOCALE
} from '@commons/constants'

interface RightHeaderProps {
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
    spacing,
    typography
  } = theme

  return createStyles({
    avatar: {
      backgroundColor: '#f49342',
      width: '32px',
      height: '32px',
      fontSize: typography.fontSize
    },
    fullname: {
      color: palette.grey[50],
      fontWeight: typography.fontWeightBold,
      fontSize: typography.fontSize
    },
    shopName: {
      color: palette.grey[50],
      fontSize: typography.fontSize
    },
    rootMenuAccount: {
      marginTop: spacing(1),
      padding: spacing(1)
    },
    rootMenuLocale: {
      marginTop: spacing(2),
      padding: spacing(1),
      '&$selected': {
        backgroundColor: 'blue'
      }
    },
    rootMenuAccount_Items: {
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeightMedium
    },
    rootMenuLocale_Items: {
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeightMedium,
      '& >img': {
        marginRight: '10px'
      }
    }
  })
})

function Account(props: RightHeaderProps) {
  const commonStyles = useCommonStyles()
  const [isMenu, setIsMenu] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const {
    t: trans
  } = useTranslation('header')

  const {
    shop,
    user
  } = props

  const arrMenu = [
    {
      id: 0,
      to: '/',
      title: 'profile'
    },
    {
      id: 1,
      to: '/',
      title: 'myAccount'
    },
    {
      id: 2,
      to: '/',
      title: 'logout',
      action: () => window.location.href = shop.logoutURL
    }
  ]

  const firstLetterName: string = user?.firstName?.charAt(0)?.toUpperCase() + user?.lastName?.charAt(0)?.toUpperCase()

  const handleMenu = () => {
    setIsMenu((prevOpen) => !prevOpen)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setIsMenu(false)
    }
  }

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setIsMenu(false)
  }


  return (
    <Fragment>
      <Button
        ref={anchorRef}
        aria-controls={isMenu ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <Avatar
          className={commonStyles.avatar}
        >
          {firstLetterName}
        </Avatar>
        <Box
          display='flex'
          justifyContent='flex-end'
          alignItems='flex-start'
          flexDirection='column'
          paddingLeft={1}
        >
          <Typography
            className={commonStyles.fullname}
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Typography
            className={commonStyles.shopName}
          >
            {shop.shopName}
          </Typography>
        </Box>
        <ArrowDropDownIcon style={{ color: '#fff' }} />
      </Button>

      <Popper
        open={isMenu} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
          >
            <Paper >
              <ClickAwayListener
                onClickAway={handleCloseMenu}
              >
                <Box>
                  <MenuList
                    classes={{
                      root: commonStyles.rootMenuAccount
                    }}
                    autoFocusItem={isMenu} id="menu-list-grow" onKeyDown={handleListKeyDown}>

                    {
                      arrMenu && arrMenu.map((val, index) => (
                        <MenuItem
                          key={index}
                          classes={{
                            root: commonStyles.rootMenuAccount_Items
                          }}
                          onClick={(event) => {
                            handleCloseMenu(event)
                            val.action && val.action()
                          }}
                        > {trans(val.title)}</MenuItem>
                      ))
                    }

                  </MenuList>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  )
}

function Locale() {
  const commonStyles = useCommonStyles()
  const { t: trans } = useTranslation('header')
  const [locale, setLocale] = useState(LOCALE.VI.VALUE)
  const [isMenu, setIsMenu] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const { i18n } = useTranslation()

  const handleMenu = () => {
    setIsMenu((prevOpen) => !prevOpen)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setIsMenu(false)
    }
  }

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setIsMenu(false)
  }

  const handleMenuItemClick = (locale: string) => {
    setLocale(locale)
    i18n.changeLanguage(locale)
  }

  return (
    <Button
      ref={anchorRef}
      onClick={handleMenu}
      variant="outlined" color="primary"
    >
      <img src={LOCALE[locale.toLocaleUpperCase()].VISUAL as unknown as string} />
      <Popper
        open={isMenu} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
          >
            <Paper >
              <ClickAwayListener
                onClickAway={handleCloseMenu}
              >
                <Box>
                  <MenuList
                    classes={{
                      root: commonStyles.rootMenuLocale
                    }}
                    autoFocusItem={isMenu} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {
                      Object.values(LOCALE).map(LANG =>
                        <MenuItem
                          key={LANG.VALUE}
                          selected={locale === LANG.VALUE}
                          classes={{
                            root: commonStyles.rootMenuLocale_Items
                          }}
                          onClick={() => handleMenuItemClick(LANG.VALUE)}>
                          <img src={LANG.VISUAL as unknown as string} alt={LANG.VALUE} />
                          {trans(LANG.VALUE)}
                        </MenuItem>
                      )
                    }
                  </MenuList>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Button>
  )
}

function RightHeader(props: RightHeaderProps) {
  return (
    <Box
      display="flex"
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Account {...props} />
      <Locale />
    </Box>
  )
}

export default RightHeader