import { Auth } from 'aws-amplify'

export const changePassword = async ({
  oldPassword,
  newPassword
}) => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    try {
      const data = await Auth.changePassword(user, oldPassword, newPassword)
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  } catch (error) {
    console.error(error)
  }
}