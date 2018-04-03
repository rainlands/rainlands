import { compose } from 'recompose'
import { inject, observer } from 'mobx-react'

import SettingsScene from './SettingsScene'


export default compose(inject('worldScene'), observer)(SettingsScene)
