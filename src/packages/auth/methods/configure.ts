import Amplify from 'aws-amplify'

import { iConfiguration } from '../models/interfaces'
import { updateConfigureStatus } from '../components/use_authentication'

export const configure = (configuration: iConfiguration) => {
  try {
    Amplify.configure(configuration)
    updateConfigureStatus(true)
  } catch (error) {
    throw Error(error)
  }
}