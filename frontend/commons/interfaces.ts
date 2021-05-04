import {
  ComponentType,
  LazyExoticComponent
} from 'react'
import {
  RouteComponentProps
} from 'react-router-dom'
import {
  OverridableComponent
} from '@material-ui/core/OverridableComponent'
import {
  SvgIconTypeMap
} from '@material-ui/core/SvgIcon'
import {
  RouterState
} from 'connected-react-router'
import {
  AppState
} from '@containers/app/app.interface'

export interface RootState {
  router: RouterState
  app: AppState
}

export interface Route {
  path?: string
  key: string
  exact?: boolean
  component: LazyExoticComponent<ComponentType<RouteComponentProps>> | any
}

export interface Link {
  to: string,
  key: string,
  name: string
}

export interface Nav {
  header?: string
  title?: string
  to?: string
  expand?: boolean
  icon?: OverridableComponent<SvgIconTypeMap> | any
  children?: Array<Nav>
}