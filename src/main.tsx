import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Authenticator } from '@aws-amplify/ui-react'
import Outputmain from './Outputmain.tsx'

import '@aws-amplify/ui-react/styles.css'

import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'


Amplify.configure(outputs)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator.Provider> {/* Providerで囲むのがコツです */}
      <Authenticator>
        <Outputmain /> {/* Propsを渡さず、ただ呼び出すだけ */}
      </Authenticator>
    </Authenticator.Provider>
  </StrictMode>,
)
