'use client'

import {FC} from 'react';
import dynamic from "next/dynamic";
import CustomImageRenderer from "@/components/renderers/CustomImageRenderer";
import CustomCodeRenderer from "@/components/renderers/CustomCodeRenderer";
import CustomListRenderer from "@/components/renderers/CustomListRenderer";
import CustomHeaderRenderer from "@/components/renderers/CustomHeaderRenderer";

const Output = dynamic(async () => (
  await import('editorjs-react-renderer')).default,
  {
    ssr: false,
  }
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
  list: CustomListRenderer,
  header: CustomHeaderRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      data={content}
      renderers={renderers}
      style={style}
      className="text-sm"
    />
  );
};
export default EditorOutput;