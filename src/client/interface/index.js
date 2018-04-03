// TODO: React + Recompose + MobX UI

import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'

import stores from '@client/stores'

import Root from './Root'


const App = () => (
  <Provider {...stores}>
    <HashRouter>
      <Route path="/" component={Root} />
    </HashRouter>
  </Provider>
)

ReactDOM.render(<App />, document.querySelector('#ui_root'))
