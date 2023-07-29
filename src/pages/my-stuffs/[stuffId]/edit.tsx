import { GetStuffByID } from '@/graphql/queries/stuff-query'
import { useQuery } from '@apollo/client'
import { Input } from '@mui/joy'
import Button from '@mui/joy/Button'
import Textarea from '@mui/joy/Textarea'
import React from 'react'

function EditPage() {
  // GET STUFF DATA
  // TODO: write query and export - done
  // TODO: useQuery with apollo client => data - done
  const { data, loading, error } = useQuery(GetStuffByID, {
    variables: {
      stuffId: '6471d29ce629fb270004f71e',
    },
  })

  // TODO: fill into form - done
//edit stuff form

//form edit stuff

  return (
    <div className="flex justify-center">
      <form className="w-3/12 p-2 border border-gray-900 rounded-md bg-slate-200">
        <div className="pb-6 border-b">
          <div className="mt-3 rounded-md bg-slate-600 h-80">
            <h4>image placeholder</h4>
          </div>
          <div className="mt-3">
            <h2 className="text-4xl font-semibold leading-7 text-gray-900">{data?.name}</h2>
            <Input value={data?.stuff?.name} />
          </div>
          <div className="mt-3 ">
            <div className="">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Desciption
              </label>
              <div className="mt-2">
                <Textarea
                  name="description"
                  className="inline-block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="">
              <label
                htmlFor="infomation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Stuff Information
              </label>
              <div className="mt-2">
                <Textarea
                  name="infomation"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="">
              <label
                htmlFor="Type"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type
              </label>
              <div className="mt-2">
                <select
                  name="Type"
                  autoComplete="Type-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>Exchange</option>
                  <option>Market</option>
                  <option>Auction</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pb-2 mt-2 gap-x-6">
          <Button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditPage
