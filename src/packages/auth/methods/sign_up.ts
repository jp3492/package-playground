import { Auth } from 'aws-amplify'
import { StatusEnum, AuthErrorsEnum } from './../models/enums'
import { updateStatus, updateError, updateUserName } from '../components/use_authentication'

export const signUp = async ({
  username,
  password,
  // attributes: {
  //   email,
  //   phone_number
  // }
}) => {
  try {
    await Auth.signUp({
      username,
      password
    })
    updateUserName(username)
    updateStatus(StatusEnum.CONFIRMATION_REQUIRED)
  } catch (error) {
    updateError(AuthErrorsEnum.RegistrationFailed)
    updateStatus(StatusEnum.SIGNED_OUT)
  }
}
