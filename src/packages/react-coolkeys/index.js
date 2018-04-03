import React, { Component } from 'react'
import Mousetrap from 'mousetrap'


const KeymapContext = React.createContext()

export const CoolKeysProvider = ({ keymap, children }) => (
  <KeymapContext.Provider value={keymap}>{children}</KeymapContext.Provider>
)

export const CoolKeys = ({ keymap, children, ...props }) => (
  <KeymapContext.Consumer>
    {(keymap) => (
      <CoolKeysBinder keymap={keymap} {...props}>
        {children}
      </CoolKeysBinder>
    )}
  </KeymapContext.Consumer>
)

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
