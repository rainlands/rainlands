import React, { Component } from 'react'
import Mousetrap from 'mousetrap'


const KeymapContext = React.createContext()

export class CoolKeysProvider extends Component {
  render() {
    return (
      <KeymapContext.Provider value={this.props.keymap}>
        {this.props.children}
      </KeymapContext.Provider>
    )
  }
}

export class CoolKeys extends Component {
  render() {
    return (
      <KeymapContext.Consumer>
        {(keymap) => (
          <CoolKeysBinder keymap={keymap} {...this.props}>
            {this.props.children}
          </CoolKeysBinder>
        )}
      </KeymapContext.Consumer>
    )
  }
}

class CoolKeysBinder extends Component {
  componentDidMount() {
    const { handlers = {}, keymap = {} } = this.props

    Object.keys(handlers).forEach((key) => {
      Mousetrap.bind(keymap[key], handlers[key])
    })
  }

  componentWillUnmount() {
    const { handlers, keymap } = this.props

    Object.keys(handlers).forEach((key) => {
      Mousetrap.unbind(keymap[key], handlers[key])
    })
  }

  render() {
    return this.props.children
  }
}
