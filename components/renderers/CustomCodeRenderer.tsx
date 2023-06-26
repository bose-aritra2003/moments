'use client'

import React from 'react';
import ReactHighlightSyntax from 'react-highlight-syntax';

function CustomCodeRenderer({ data }: any) {

  return (
    <ReactHighlightSyntax
      language='C'
      theme='Monokai'
      copy
      copyBtnTheme='Dark'
    >
      {data.code}
    </ReactHighlightSyntax>
  )
}

export default CustomCodeRenderer




// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
//
// function CustomCodeRenderer({ data }: any) {
//
//   return (
//     <SyntaxHighlighter language="c" style={monokai}>
//       {data.code}
//     </SyntaxHighlighter>
//   )
// }
//
// export default CustomCodeRenderer