import stuffIssueQuery from '@/graphql/queries/stuff-issue-query'
import { useMutation } from '@apollo/client'
import { Button } from '@mui/joy'
import { useRouter } from 'next/router'
import React from 'react'

const StuffIssueDetail = () => {
  const router = useRouter()
  const [confirmSolved, { data, loading, error }] = useMutation(stuffIssueQuery.confirm())
  console.log('🚀 ~ file: [issueId].tsx:10 ~ StuffIssueDetail ~ data:', data)

  const handleConfirmSolved = () => {
    const issueId = router.query.issueId
    if (!issueId) return
    confirmSolved({
      variables: {
        id: issueId,
      },
    })
  }

  return (
    <div>
      <Button onClick={handleConfirmSolved}>Xác nhận</Button>
    </div>
  )
}

export default StuffIssueDetail
// it('confirm_solved_called', () => {
//   const confirmSolved = jest.fn()
//   const router = { query: { issueId: '123' } }
//   const { getByRole } = render(<StuffIssueDetail />, { wrapper: MemoryRouter })
//   fireEvent.click(getByRole('button'))
//   expect(confirmSolved).toHaveBeenCalledWith({ variables: { id: '123' } })
// })