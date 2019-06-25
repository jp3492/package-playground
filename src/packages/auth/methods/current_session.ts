import { Auth } from 'aws-amplify'

export const refreshSession = async () => {
  try {
    const data = await Auth.currentSession()
    // update tokens
    return data
  } catch (error) {
    throw Error(error)
  }
}