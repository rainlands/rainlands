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
        <div>GUI</div>
      </CoolKeys>
    )
  }
}
