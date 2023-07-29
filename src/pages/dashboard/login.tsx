import { NextPageWithLayout } from '../_app'
import { isAdminOrModerator } from '@/components/context/auth-context-container'
import { useAuth } from '@/contexts/auth-context'
import { resourceUrls } from '@/libs/resource-urls'
import { Button, Input } from '@mui/joy'
import { Form, Formik, FormikValues } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import * as Yup from 'yup'

const DashboardLoginPage: NextPageWithLayout = () => {
  const { isValidating, signInWithEmailPassword, user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (user && isAdminOrModerator(user.role)) {
      router.push(resourceUrls.dashboard.base)
    }
  }, [router, user])

  const initialValues = {
    email: '',
    password: '',
  }

  const handleSubmit = (values: FormikValues) => {
    signInWithEmailPassword(values.email, values.password)
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Vui lòng nhập email').email(),
    password: Yup.string().required('Vui lòng nhập mật khẩu').min(6).max(16),
  })
// login form
  return (
    <div className="flex items-center justify-center w-full h-screen max-w-full py-16">
      <div className="flex max-w-lg mx-auto w-full">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          validateOnBlur={true}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors }) => {
            return (
              <Form className="w-full mx-3">
                <h3 className="mb-4 text-center">Đăng nhập</h3>
                <div className="space-y-4">
                  <div>
                    <Input
                      id="email"
                      name="email"
                      value={values.email}
                      type="text"
                      placeholder="Tài khoản hoặc email"
                      onChange={(e) => {
                        setFieldValue('email', e.target.value)
                      }}
                      disabled={isValidating}
                    />
                    {errors.email && (
                      <div className="mt-1 ml-2 text-sm text-red-600">{errors.email}</div>
                    )}
                  </div>
                  <div>
                    <Input
                      id="password"
                      name="password"
                      value={values.password}
                      type="password"
                      placeholder="Mật khẩu"
                      onChange={(e) => {
                        setFieldValue('password', e.target.value)
                      }}
                      disabled={isValidating}
                    />
                    {errors.password && (
                      <div className="mt-1 ml-2 text-sm text-red-600">{errors.password}</div>
                    )}
                  </div>
                  <Button
                    disabled={isValidating}
                    variant="solid"
                    color="primary"
                    className="bg-primary-500"
                    fullWidth
                    size="lg"
                    type="submit"
                  >
                    Đăng nhập
                  </Button>
                  <Link
                    className="block w-full mt-4 text-sm font-medium text-center text-slate-500"
                    href="#"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

DashboardLoginPage.getLayout = (page) => page

export default DashboardLoginPage
