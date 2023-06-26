'use client'

function CustomHeaderRenderer({ data }: any) {
  switch (data.level) {
    case 1:
      return <h1 className="text-xl font-bold">{data.text}</h1>;
    case 2:
      return <h2 className="text-lg font-bold">{data.text}</h2>;
    case 3:
      return <h3 className="text-base font-bold">{data.text}</h3>;
    case 4:
      return <h4 className="text-base font-bold">{data.text}</h4>;
    case 5:
      return <h5 className="text-sm font-bold">{data.text}</h5>;
    case 6:
      return <h6 className="text-sm font-bold">{data.text}</h6>;
    default:
      return <h1 className="text-xl font-bold">{data.text}</h1>;
  }
}

export default CustomHeaderRenderer;