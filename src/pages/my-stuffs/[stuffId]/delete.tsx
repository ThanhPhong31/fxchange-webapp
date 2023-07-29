import Button from '@mui/joy/Button'
import React from 'react'

function DeleteConfirmation() {

  //delete stuff confirm modal
  return (
    <div className="flex justify-center mt-24 ">
      <form className="bg-slate-100 border border-gray-900 p-2 w-3/12 rounded-md">
        <div className="flex justify-center mt-0 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="red"
            className="w-1/4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="mt-3 text-center ">
          <h2 className=" text-4xl font-semibold leading-7 text-gray-900">Delete Stuff</h2>
          <p className=" text-md font-semibold leading-relaxed text-gray-500 mt-4">
            Do you really want to delete these stuff? <br /> This process cannot be undo.{' '}
          </p>
        </div>
        <div className="pb-2  mt-2 flex items-center justify-center gap-x-6">
          <Button
            color="neutral"
            type="button"
            className=" w-1/2 "
          >
            Cancel
          </Button>
          <Button
            color="danger"
            type="submit"
            className=" w-1/2 "
          >
            Delete
          </Button>
        </div>
      </form>
    </div>
  )
}
// it('display_confirmation_message', () => {
//   const { getByText } = render(<DeleteConfirmation />);
//   expect(getByText('Delete Stuff')).toBeInTheDocument();
//   expect(getByText('Do you really want to delete these stuff? This process cannot be undo.')).toBeInTheDocument();
// });
export default DeleteConfirmation
