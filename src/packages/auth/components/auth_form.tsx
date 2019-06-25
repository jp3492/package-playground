import React, { useState } from 'react'

import { Form } from './forms/form'
import { addIdsToObject } from './forms/utils'

import { ViewEnum, StatusEnum, ViewLabelEnum } from '../models/enums'
import { signIn, signUp, completePassword, forgotPassword, forgotPasswordSubmit, changePassword, confirm } from '../methods'

import { username } from './use_authentication'

const config = ({
  name,
  description,
  mfaType = null
}) => addIdsToObject({
  name,
  description,
  submitLabel: "Submit",
  formFields: {
    email: {
      label: "Email",
      type: "input",
      inputType: "email",
      validation: {
        required: true
      },
      hidden: true
    },
    username: {
      label: "Username/Email",
      type: "input",
      inputType: "text",
      validation: {
        required: true
      },
      hidden: true
    },
    password: {
      label: "Password",
      type: "input",
      inputType: "password",
      validation: {
        required: true
      },
      hidden: true
    },
    mfaType: {
      type: "input",
      inputType: "text",
      defaultValue: mfaType,
      hidden: true
    },
    mfaCode: {
      label: "MFA-Code",
      type: "input",
      inputType: "text",
      validation: {
        required: true
      },
      hidden: true
    },
    new_password: {
      label: "New Password",
      type: "input",
      inputType: "password",
      validation: {
        required: true
      },
      hidden: true
    },
    code: {
      label: "Code",
      type: "input",
      inputType: "text",
      validation: {
        required: true
      },
      hidden: true
    }
  }
})

const fieldsByStatus = {
  [ViewEnum.SIGN_UP]: [
    "username",
    "password"
  ],
  [ViewEnum.SIGN_IN]: [
    "username",
    "password"
  ],
  [ViewEnum.FORGOT_PASSWORD]: [
    "username"
  ],
  [ViewEnum.COMPLETE_PASSWORD]: [
    "newPassword"
  ],
  [ViewEnum.MFA]: [
    "mfaCode"
  ],
  [ViewEnum.CONFIRM]: [
    "code"
  ],
  [ViewEnum.FORGOT_PASSWORD_SUBMIT]: [
    "code",
    "new_password"
  ]
}

const statusToView = {
  [StatusEnum.SIGNED_OUT]: ViewEnum.SIGN_IN,
  [StatusEnum.SMS_MFA]: ViewEnum.MFA,
  [StatusEnum.SOFTWARE_TOKEN_MFA]: ViewEnum.MFA,
  [StatusEnum.NEW_PASSWORD_REQUIRED]: ViewEnum.COMPLETE_PASSWORD,
  [StatusEnum.CONFIRMATION_REQUIRED]: ViewEnum.CONFIRM,
  [StatusEnum.PASSWORD_RESETTED]: ViewEnum.FORGOT_PASSWORD_SUBMIT,
  [StatusEnum.SIGNED_IN]: ViewEnum.IDLE
}

const actionByView = {
  SIGN_IN: signIn,
  SIGN_UP: signUp,
  MFA: val => console.log(val),
  COMPLETE_PASSWORD: completePassword,
  FORGOT_PASSWORD: forgotPassword,
  CHANGE_PASSWORD: changePassword,
  CONFIRM: values => confirm({ ...values, username }),
  FORGOT_PASSWORD_SUBMIT: values => forgotPasswordSubmit({ ...values, username })
}

const linksByView = view => {
  switch (view) {
    case ViewEnum.SIGN_IN: return [ViewEnum.SIGN_UP, ViewEnum.FORGOT_PASSWORD]
    case ViewEnum.SIGN_UP: return [ViewEnum.SIGN_IN]
    case ViewEnum.CHANGE_PASSWORD: return []
    default: return [ViewEnum.SIGN_IN]
  }
}

const trimValues = (fields, values) =>
  Object.keys(values).reduce((res, v) =>
    fields.includes(v) ? { ...res, [v]: values[v] } : res, {})

export const AuthForm = ({
  status
}) => {
  const [view, setView] = useState(statusToView[status.auth])
  const [loading, setLoading] = useState(false)

  if (view === ViewEnum.IDLE) {
    return null
  }

  const formProps = config({
    name: ViewLabelEnum[view],
    description: ""
  })

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await actionByView[view](trimValues(fieldsByStatus[view], values))
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  return (
    <div className="ptf__authentication__form">
      {/* maybe a different header */}
      <Form
        onSubmit={handleSubmit}
        visibleFields={fieldsByStatus[view]}
        loading={loading}
        {...formProps} />
      <ul>
        {
          linksByView(view).map((l, i) => (
            <li
              onClick={() => setView(l)}
              key={i}>
              {ViewLabelEnum[l]}
            </li>
          ))
        }
      </ul>
      <label>
        {status.error}
      </label>
    </div>
  )
}