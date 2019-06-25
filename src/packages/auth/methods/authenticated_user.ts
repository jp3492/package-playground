import { Auth } from 'aws-amplify';
import { updateUser } from '../components/use_authentication'

export const getCurrentUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    updateUser(user)
    return user
  } catch (error) {
    throw Error(error)
  }
}