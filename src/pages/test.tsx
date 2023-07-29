import { CreateStuffQuery } from '@/graphql/queries/stuff-query'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Input } from '@mui/joy'
import React, { useEffect, useState } from 'react'

interface Data {
  name: string
  description: string
}

function Test() {
  const [count, setCount] = useState(0)
  const [mutateFunction, { data, loading, error }] = useMutation(CreateStuffQuery, {})
  const [dataFromDB, setDataFromDB] = useState<any | null>(null)

  // Only use for side effect

  async function callApi() {
    const data = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    return await data.json()
  }

  function handleSubmit() {
    mutateFunction({
      variables: {
        input: {
          name: ' iPhone 14',
          author_id: '111230125052579288677',
          description: ' iPhone 14, dung lượng 128GB.',
          category_id: '6467d8e463220063c879f62d',
          condition: 10,
          type_id: '6467d8e463220063c879f631',
          custom_field: {
            price: 10000000,
          },
          media: ['nam.png'],
          tags: [
            { tag_id: '6471cd0f0299734e6009c483', value: 'Xl' },
            { tag_id: '6471cd0f0299734e6009c483', value: 'Red' },
          ],
        },
      },
    })
  }
// it('test_sign_in_with_server_token_success', async () => {
//       const authServices = new AuthServices()
//       const user = await authServices.signInWithServer('token', {
//         uid: '123',
//         full_name: 'Test User',
//         email: 'test@test.com',
//         avatar_url: 'http://example.com/avatar.jpg',
//         phone: '1234567890',
//         address: '123 Main St.',
//         role: 'user',
//         point: 0,
//         auction_nickname: 'Test User',
//         invitation_code: 'ABC123',
//         need_update: false
//       })
//       expect(user).toEqual({
//         uid: '123',
//         full_name: 'Test User',
//         email: 'test@test.com',
//         avatar_url: 'http://example.com/avatar.jpg',
//         phone: '1234567890',
//         address: '123 Main St.',
//         role: 'user',
//         point: 0,
//         auction_nickname: 'Test User',
//         invitation_code: 'ABC123',
//         need_update: false
//       })
//     })
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Input
        placeholder="Name"
        value={dataFromDB?.title}
        onChange={(e) => {
          setDataFromDB((prevData: any) => {
            return {
              title: e.target.value,
            }
          })
        }}
      />
      <Input
        placeholder="Description"
        value={dataFromDB?.id}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}
  //  ('returns_page', () => {
  //       const page = <div>Test Page</div>;
  //       const result = Login.getLayout(page);
  //       expect(result).toBe(page);
  //   });

export default Test
