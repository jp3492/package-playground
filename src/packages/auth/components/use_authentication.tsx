import React, { useState, useEffect } from 'react'

import { AuthForm } from './auth_form'
import { StatusEnum } from '../models/enums'
import { iConfiguration } from '../models/interfaces'

// check for other statuses that are not listed here
const awsStatusMap = {
  signIn: StatusEnum.SIGNED_OUT,
  signedIn: StatusEnum.SIGNED_IN
}

export let user: any = {}
export let username: string = ""

let configure_status: boolean = false
let auth_status: string = awsStatusMap[localStorage.getItem("amplify-authenticator-authState") || "signIn"]
let auth_subscriptions: any[] = []
let auth_error: string = ""

export const updateUserName = name => {
  username = name
}
export const updateConfigureStatus = status => {
  configure_status = status
}
export const updateUser = user => {
  user = user
}
export const updateError = error => {
  auth_error = error
  return auth_subscriptions.forEach(s => s({ auth: auth_status, error }))
}
export const updateStatus = auth => {
  auth_status = auth
  return auth_subscriptions.forEach(s => s({ auth, error: auth_error }))
}

export const useAuthentication = () => {
  const [status, setStatus] = useState({
    auth: auth_status,
    error: auth_error
  })

  useEffect(() => {
    if (!auth_subscriptions.includes(setStatus)) {
      auth_subscriptions = [
        ...auth_subscriptions,
        setStatus
      ]
    }
    return () => {
      auth_subscriptions = auth_subscriptions.filter(s => s !== setStatus)
    }
  }, [])

  const AuthInterface = () => (
    <AuthForm
      status={status} />
  )

  if (!configure_status) {
    console.error("Authentication has not been configured.")
    return {
      status: "NOT_CONFIGURE",
      AuthInterface: () => null
    }
  }

  return {
    status: status.auth,
    AuthInterface
  }
}