'use client'

function CustomListRenderer({ data }: any) {

  return (
    <ul className="list-disc list-inside">
      {
        data.items.map((item: any, index: number) => (
          <li key={index}>{item}</li>
        ))
      }
    </ul>
  )
}

export default CustomListRenderer;