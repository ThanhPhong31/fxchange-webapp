import React from 'react'

const FormLabel = ({ title, htmlFor }: { title: string; htmlFor?: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}
    >
      <label htmlFor={htmlFor}>{title}</label>
    </div>
  )
}

export default FormLabel
