import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { configure } from './packages/auth'

configure({
  'aws_project_region': 'eu-central-1',
  'aws_appsync_region': 'eu-central-1',
  'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS',
  'aws_cognito_region': 'eu-central-1',
  'aws_user_pools_id': 'eu-central-1_EBLg8Gmd6',
  'aws_user_pools_web_client_id': '19a5bdfkpb40n83nre71ep4oqg',
  Analytics: {
    disabled: true
  }
})

ReactDOM.render(<App />, document.getElementById('root'));

