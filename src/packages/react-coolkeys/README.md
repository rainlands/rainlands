# react-coolkeys

> Simple hotkeys management for React.js

## Usage

```js
// Root.js

import React, { Component } from 'react'
import { CoolKeysProvider } from '@packages/react-coolkeys'

import Child from './Child'

export default class Root extends Component {
  render() {
    return (
      <CoolKeysProvider
        keymap={{
          deleteNode: ['del', 'backspace'],
        }}
      >
        <Child />
      </CoolKeysProvider>
    )
  }
}
```

```js
// Child.js

import React, { Component } from 'react'
import { CoolKeys } from '@packages/react-coolkeys'

export default class GUI extends Component {
  render() {
    return (
      <CoolKeys
        handlers={{
          deleteNode: () => {
            console.log('DELETE NODE')
          },
        }}
      >
        <div>This is the Child</div>
      </CoolKeys>
    )
  }
}
```
