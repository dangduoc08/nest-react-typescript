import * as React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import PriorityHighRoundedIcon from '@material-ui/icons/PriorityHighRounded'
import {
  useTranslation
} from 'react-i18next'

import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => {
  const {
    spacing,
    typography
  } = theme

  return createStyles({
    root: {
      margin: spacing(2, 15),
      borderRadius: 10,
      padding: spacing(5, 2)
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: typography.fontSize
    },
    icon: {
      width: 60,
      height: 60,
      borderRadius: 60 / 2,
      backgroundColor: 'rgb(140, 145, 150)',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      marginBottom: spacing(5)
    },
    txtError: {
      fontWeight: 400,
      fontSize: typography.fontSize + 5
    },
    txtError_2: {
      fontSize: typography.fontSize,
      color: '#6D7175'
    }
  })

})

function Error() {

  const classes = useStyles()
  const {
    t: trans
  } = useTranslation('notFound')

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent
        component='div'
        className={classes.container}
        style={{ maxHeight: '100%' }}
      >

        <div className={classes.icon} >
          <PriorityHighRoundedIcon fontSize="large" style={{ color: '#fff' }} />
        </div>

        <Typography
          className={classes.txtError} gutterBottom>
          {trans('addressNotFound')}
        </Typography>


        <Typography className={classes.txtError_2} gutterBottom>
          {trans('checkURL')}
        </Typography>

      </CardContent>

    </Card>
  )
}

export default Error