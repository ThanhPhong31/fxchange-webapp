import { District, Province, Response, Ward } from '@/components/ui/common/CheckoutForm'
import { getSignInProvider } from '@/libs/auth'
import axiosClient from '@/libs/axios-client'
import { app } from '@/libs/firebase'
import { AuthResponse, User as UserState } from '@/types/model'
import axiosDefault from 'axios'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth'

class AuthServices {
  async signInWithProvider() {
    const auth = getAuth(app)
    const provider = getSignInProvider()
    await signInWithPopup(auth, provider)
  }
  async signInWithEmailAndPassword(email: string, password: string) {
    const auth = getAuth(app)
    await firebaseSignInWithEmailAndPassword(auth, email, password)
  }
  async signInWithServer(token: string, userCredential?: User): Promise<UserState> {
    const result: AuthResponse = await axiosClient.post('auth/login', { idToken: token })
    console.log(result)
    return {
      email: result.data.email as string,
      full_name: result.data.full_name || null,
      avatar_url: result.data.photo_url || null,
      role: result.data.role,
      uid: result.data.uid,
      point: result.data.point,
      auction_nickname: result.data?.auction_nickname,
      invitation_code: result.data.invitation_code,
      need_update: result.data.need_update,
      phone: result.data.phone,
    }
  }
  // it('sign_in_with_provider_success', async () => {
  //   const authServices = new AuthServices()
  //   const user = await authServices.signInWithProvider()
  //   expect(user).toBeDefined()
  // })

  async logout() {
    return await axiosClient.post('auth/logout')
  }
}

export default new AuthServices() as AuthServices
//get province
export const apiGetPublicProvinces: () => Promise<Response<Province>> = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosDefault({
        method: 'get',
        url: 'https://vapi.vnappmob.com/api/province/',
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

type GetPublicDistrictArgs = (provinceId: string) => Promise<Response<District> | null>
//get distric with provinceId
export const apiGetPublicDistrict: GetPublicDistrictArgs = async (provinceId: string) => {
  try {
    const response: Response<District> = await axiosDefault({
      method: 'get',
      url: `https://vapi.vnappmob.com/api/province/district/${provinceId}`,
    })
    return response
  } catch (error) {
    throw error
  }
}
//get ward with districtId
export const apiGetPublicWard: (districtId: string) => Promise<Response<Ward>> = (
  districtId: string
) =>
  new Promise(async (resolve, reject) => {
    try {
      const response: Response<Ward> = await axiosDefault({
        method: 'get',
        url: `https://vapi.vnappmob.com/api/province/ward/${districtId}`,
      })
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })

// export const AuthServices = {
//   signInWithProvider: async () => {
//     const auth = getAuth(app)
//     try {
//       const provider = getSignInProvider()
//       await signInWithPopup(auth, provider)
//     } catch (error) {
//       console.log('🚀 ~ file: auth.ts:31 ~ signInWithProvider: ~ error:', error)
//       signOut(auth)
//     }
//   },
//   signInWithServer: async (token: string, userCredential?: User): Promise<UserState> => {
//     const result: AuthResponse = await axiosClient.post('auth/login', { idToken: token })
//     console.log('🚀 ~ file: auth.ts:31 ~ signInWithServer: ~ result:', result)

//     return {
//       email: result.data.email as string,
//       full_name: result.data.full_name || null,
//       photo_url: result.data.photo_url || null,
//       role: result.data.role,
//       uid: result.data.uid,
//     }
//   },
// }
// it('general_behaviour_logout_response_from_server', async () => {
//   const authServices = new AuthServices()
//   axiosClient.post = jest.fn().mockResolvedValue({ status: 200, data: { message: 'Logged out successfully' } })
//   const response = await authServices.logout()
//   expect(response.data.message).toBe('Logged out successfully')
// })