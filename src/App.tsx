import React from 'react'
import './style.css'
import { useAuthentication } from './packages/auth'

const App: React.FC = () => {
  const { status, AuthInterface } = useAuthentication()

  console.log(status)

  return (
    <div className="App">
      <AuthInterface />
      {
        status === "SIGNED_IN" ?
          <div>
            Authenticated App
          </div> :
          <div>
            Not Authenticated App
          </div>
      }
    </div>
  );
}

export default App;
