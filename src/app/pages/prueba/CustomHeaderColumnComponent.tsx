// @ts-nocheck
import {FC} from 'react'
import {ColumnInstance} from 'react-table'
//import {User} from '../../core/_models'

type User = {
    id?: ID
    name?: string
    avatar?: string
    email?: string
    position?: string
    role?: string
    last_login?: string
    two_steps?: boolean
    joined_day?: string
    online?: boolean
    initials?: {
      label: string
      state: string
    }
  }

type Props = {
  column: ColumnInstance<User>
}

const CustomHeaderColumnComponent: FC<Props> = ({column}) => {
    return (
    
  <>
    {column.Header && typeof column.Header === 'string' ? (
      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
    ) : (
      column.render('Header')
    )}
  </>
)
    }
export {CustomHeaderColumnComponent}
