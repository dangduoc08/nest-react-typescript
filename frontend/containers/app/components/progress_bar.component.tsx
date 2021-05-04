import * as React from 'react'
import {
  makeStyles,
  Theme
} from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  RootState
} from '@commons/interfaces'
import {
  useSelector,
  useDispatch
} from 'react-redux'
import {
  actions
} from '../app.slice'


const useStyles = makeStyles((theme: Theme) => {
  const {
    zIndex
  } = theme

  return ({
    container: {
      zIndex: zIndex.drawer + 2,
      width: '100%',
      top: 0,
      position: 'fixed'
    },
    rootLinear: {
      height: '2px'
    },
    barColorPrimary: {
      backgroundColor: '#00E5FF'
    },
    colorPrimary: {
      backgroundColor: '#06183E'
    }
  })
})

function ProgressBar() {

  const classes = useStyles()
  const [progress, setProgress] = React.useState(0)
  const [isShow, setIsShow] = React.useState(false)

  const numLoading = useSelector((state: RootState) => state.app.numLoading)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (numLoading && numLoading > 0) {
      setIsShow(true)
      setTimeout(() => {
        if (numLoading > progress) {
          const diff = Math.random() * 10
          setProgress((numLoading + diff) > 100 ? 100 : (numLoading + diff))
        }
      }, 500)
    }
  }, [numLoading])

  React.useEffect(() => {
    if (progress && progress === 100) {
      setTimeout(() => {
        dispatch(actions.showLoading(0))
        setIsShow(false)
        setProgress(0)
      }, 500)
    }
  }, [progress])


  return (
    <div className={classes.container}>
      {
        isShow &&
        <LinearProgress
          variant="determinate"
          value={progress}
          classes={{
            root: classes.rootLinear,
            barColorPrimary: classes.barColorPrimary,
            colorPrimary: classes.colorPrimary
          }}
        />
      }
    </div>
  )

}
export default ProgressBar