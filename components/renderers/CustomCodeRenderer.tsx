'use client'

import 'highlight.js/styles/monokai.css';
import hljs from 'highlight.js/lib/common';
import {useEffect} from "react";

function CustomCodeRenderer({ data }: any) {
    useEffect(() => {
        hljs.highlightAll();
    }, []);

  return (
    <pre>
      <code className="hljs rounded-md">
        {data.code}
      </code>
    </pre>

  )
}

export default CustomCodeRenderer