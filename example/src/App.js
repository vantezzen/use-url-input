import React from 'react'

import { useMyHook } from 'use-url-input'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
