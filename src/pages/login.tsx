import { NextPageWithLayout } from './_app'
import { IGoogle } from '@/components/ui/common/icons'
import Input from '@/components/ui/common/input'
import Logo from '@/components/ui/common/logo'
import { useAuth } from '@/contexts/auth-context'
import { Button, Divider } from '@mui/joy'
import Link from 'next/link'

const Login: NextPageWithLayout = () => {
  const { signIn, isValidating } = useAuth()
  // login using fpt mail
  return (
    <div className="flex items-center w-full h-screen max-w-full py-16">
      <div className="flex h-[700px] w-full">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="">
            <div className="flex justify-center mb-6">
              <Logo
                className="mx-auto"
                hideText
              />
            </div>
            <h3 className="w-full mb-6 text-center text-slate-800">Đăng nhập ngay</h3>
            {/* <p className="mb-3 text-sm text-center text-slate-600">
              Sử dụng email trường là một lựa chọn sáng suốt.
            </p> */}
            <Button
              variant="outlined"
              fullWidth
              className="border-slate-200 text-slate-700"
              color="neutral"
              size="lg"
              disabled={isValidating}
              startDecorator={
                <IGoogle
                  width="25px"
                  height="25px"
                />
              }
              onClick={() => signIn()}
            >
              Tiếp tục với email FPT
            </Button>
          </div>
        </div>
        {/* <div className="flex flex-1">
          <div className="relative flex items-end justify-center w-full h-full max-w-full overflow-hidden bg-slate-200 rounded-l-3xl">
            <FxImage
              alt="bg-image"
              className="object-cover w-full h-full"
              src={
                'https://images.unsplash.com/photo-1516950038693-c8fef9c796ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1167&q=80'
              }
            />
            <div className="absolute bottom-0 left-0 w-full p-16 text-white bg-gradient-to-t from-black to-transparent">
              <h1 className="mb-3">Trao đổi, mua bán nhanh</h1>
              <p className="text-xl">
                Cùng nhau kết nối, chia sẻ và trao đổi mọi thứ xung quanh bạn
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

Login.getLayout = (page) => page

export default Login
