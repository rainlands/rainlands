import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { CoolKeysProvider } from '@packages/react-coolkeys'

import UI from './ui'
import GUI from './gui'

@inject('settingsStore')
@observer
export default class Root extends Component {
  render() {
    return (
      <CoolKeysProvider keymap={this.props.settingsStore.keymap}>
        <Switch>
          <Route path="/ui" component={UI} />
          <Route path="/gui" component={GUI} />
        </Switch>
      </CoolKeysProvider>
    )
  }
}
