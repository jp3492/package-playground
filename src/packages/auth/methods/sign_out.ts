import { Auth } from 'aws-amplify'
import { StatusEnum } from '../models/enums'
import { updateStatus } from '../components/use_authentication'

export const signOut = async () => {
  try {
    await Auth.signOut()
  } catch (error) {
    console.error(error)
  }
  updateStatus(StatusEnum.SIGNED_OUT)
}