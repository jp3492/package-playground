import React, { useState, useEffect, memo } from 'react'
import { Field } from './fields'

import {
  getInitialValues,
  getInitialTouches,
  getInitialErrors,
  getValueByPath,
  setValueByPath,
  validateForm,
  isFormValid
} from './utils'


interface iForm {
  initialValues?: any,
  name: string,
  description?: string,
  formFields: any,
  handleSubmit?: Function,
  grid?: string[],
  submitLabel?: string,
  onSubmit: Function,
  onChange?: Function,
  visibleFields?: string[],
  hiddenFields?: string[],
  enabledFields?: string[],
  disabledFields?: string[],
  loading?: boolean
}

export const Form = memo((props: iForm) => {
  const [values, setValues] = useState(getInitialValues(props))
  const [touches, setTouches] = useState(getInitialTouches(props))
  const [errors, setErrors] = useState(getInitialErrors(props))
  const [checkErrors, setCheckErrors] = useState(false)

  const {
    name,
    description,
    formFields,
    grid,
    submitLabel,
    onSubmit,
    onChange = () => { },
    enabledFields = [],
    disabledFields = [],
    visibleFields = [],
    hiddenFields = [],
    loading = false
  } = props

  useEffect(() => {
    onChange(values)
  }, [values])

  useEffect(() => {
    if (checkErrors) {
      setErrors(validateForm(formFields, values, errors)) // not sure if its smart to validate the whole form on every value change
    }
  }, [values, touches])

  const handleChange = (field, value) => {
    if (!checkErrors) {
      setCheckErrors(true)
    }
    setValues(setValueByPath(values, field, value))
  }

  const handleBlur = (field: string) => {
    if (!checkErrors) {
      setCheckErrors(true)
    }
    if (!getValueByPath(touches, field)) {
      setTouches(setValueByPath(touches, field, true))
    }
  }

  const disabled = loading ? { disabled: true } : {}

  return (
    <form
      className="ptf">
      <h1>
        {name}
      </h1>
      {
        description &&
        <p>
          {description}
        </p>
      }
      <ul
        style={{
          gridTemplateAreas: grid ? `${`'${grid.join("' '")}'`}` : ""
        }}
        className="ptf__fields">
        {
          Object.keys(formFields).map((f, i) => {
            let fieldProps = {
              ...formFields[f],
              key: i,
              value: getValueByPath(values, formFields[f].id),
              error: getValueByPath(errors, formFields[f].id),
              touched: getValueByPath(touches, formFields[f].id),
              onChange: ({ target: { value } }, id) =>
                handleChange(id || formFields[f].id, value),
              onBlur: (id) => handleBlur(typeof id === "string" ? id : formFields[f].id),
              disabledFields,
              enabledFields,
              visibleFields,
              hiddenFields
            }
            delete fieldProps.initialValue
            return <Field {...fieldProps} />
          })
        }
      </ul>

      <button
        {
        ...disabled
        }
        onClick={(e) => {
          e.preventDefault()
          onSubmit(values)
        }}
        className="button">
        {submitLabel}
      </button>
    </form>
  )
})