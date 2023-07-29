import { useAuth } from '@/contexts/auth-context'
import userQuery from '@/graphql/queries/user-query'
import { useMutation } from '@apollo/client'
import { Button, FormControl, FormLabel, Input } from '@mui/joy'
import { ErrorMessage, Form, Formik, FormikValues } from 'formik'
import * as Yup from 'yup'

const UpdatePhoneForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { updatePhone } = useAuth()
  const [updateInfo, { data: updatedInfoResult, loading: updatingInfo, error: errorOnUpdateInfo }] =
    useMutation<{
      user: {
        id: string
        information: {
          phone: string
        }
      }
    }>(userQuery.updateInfo())

  const handleSubmit = async (values: FormikValues) => {
    try {
      console.log('🚀 ~ file: update-phone-form.tsx:7 ~ UpdatePhoneForm ~ values:', values)
      const response = await updateInfo({
        variables: {
          input: {
            information: {
              phone: values.phone,
            },
          },
        },
      })
      if (response.data) {
        updatePhone(response.data?.user.information.phone)
        onSuccess()
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const validateSchema = Yup.object().shape({
    phone: Yup.string()
      .min(10, 'Số điện thoại không hợp lệ')
      .max(11, 'Số điện thoại không hợp lệ')
      .required('Vui lòng nhập số điện thoại của bạn'),
  })
//update phone
  return (
    <Formik
      initialValues={{
        phone: '',
      }}
      validationSchema={validateSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="flex flex-col h-full">
            <FormControl>
              <FormLabel required>Số điện thoại</FormLabel>
              <Input
                placeholder="035xxxxxxxx"
                value={values.phone}
                type="number"
                onChange={(e) => setFieldValue('phone', e.target.value)}
              />
              <ErrorMessage
                name="phone"
                className="text-xs text-red-600"
              />
            </FormControl>

            <Button
              type="submit"
              color="info"
              variant="soft"
              fullWidth
              className="mt-4"
              loading={updatingInfo}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default UpdatePhoneForm
