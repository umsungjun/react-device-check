interface CodeBlockProps {
  code: string;
  filename?: string;
}

export default function CodeBlock({ code, filename }: CodeBlockProps) {
  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <span className="codeblock-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {filename && <span className="codeblock-name">{filename}</span>}
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
