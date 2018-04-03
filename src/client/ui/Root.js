import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import SettingsScene from './scenes/SettingsScene'


export default class Root extends Component {
  render() {
    return (
      <Switch>
        <Route path="settings" component={SettingsScene} />
      </Switch>
    )
  }
}
