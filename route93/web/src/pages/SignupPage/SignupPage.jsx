import { useEffect, useRef, useState } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import AddressAutocomplete from 'src/components/AddressAutocomplete/AddressAutocomplete'

const SignupPage = () => {
  const { isAuthenticated, currentUser, signUp } = useAuth()

  // focus on name box on page load
  const nameRef = useRef(null)
  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const [address, setAddress] = useState({ address1: '', address2: '', city: '', state: '', zipCode: '', country: 'IE' })
  const onSubmit = async (data) => {
    try {
      const response = await signUp({
        username: data.username,
        password: data.password,
        name: data.name,
        phone: data.phone,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        zip: address.zipCode,
        country: address.country,
      })

      if (response.message) {
        toast(response.message)
      } else if (response.error) {
        toast.error(response.error)
      } else {
        toast.success('Check your email to verify your account')
        setTimeout(() => navigate(routes.login()), 500)
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.')
    }
  }

  // If already authenticated, redirect immediately without useEffect
  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'ADMIN') {
      navigate(routes.admin())
    } else {
      navigate(routes.home())
    }
    return null
  }

  return (
    <>
      <Metadata title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Signup</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="name"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Full Name
                  </Label>
                  <TextField
                    name="name"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={nameRef}
                    validation={{
                      required: {
                        value: true,
                        message: 'Full name is required',
                      },
                    }}
                  />

                  <FieldError name="name" className="rw-field-error" />

                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Email
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        value: true,
                        message: 'Email is required',
                      },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    }}
                  />

                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />

                  <FieldError name="password" className="rw-field-error" />

                  <Label name="phone" className="rw-label" errorClassName="rw-label rw-label-error">
                    Phone
                  </Label>
                  <TextField name="phone" className="rw-input" errorClassName="rw-input rw-input-error" />
                  <FieldError name="phone" className="rw-field-error" />

                  <div className="mt-4">
                    <Label name="address1" className="rw-label">Address</Label>
                    <AddressAutocomplete
                      value={address.address1}
                      onAddressSelected={(addr) => setAddress({ ...address, ...addr })}
                      onChange={(val) => setAddress({ ...address, address1: val })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    <div>
                      <Label name="city" className="rw-label">City</Label>
                      <TextField name="city" value={address.city} onChange={(e)=>setAddress({...address, city:e.target.value})} className="rw-input" />
                    </div>
                    <div>
                      <Label name="state" className="rw-label">State</Label>
                      <TextField name="state" value={address.state} onChange={(e)=>setAddress({...address, state:e.target.value})} className="rw-input" />
                    </div>
                    <div>
                      <Label name="zip" className="rw-label">ZIP</Label>
                      <TextField name="zip" value={address.zipCode} onChange={(e)=>setAddress({...address, zipCode:e.target.value})} className="rw-input" />
                    </div>
                  </div>

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      Sign Up
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Already have an account?</span>{' '}
            <Link to={routes.login()} className="rw-link">
              Log in!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
