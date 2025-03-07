import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

export const MarkdownComponents: Components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    return !inline ? (
      <div className="rounded-md overflow-hidden my-2">
        <SyntaxHighlighter
          style={atomDark}
          language={language}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-zinc-200 dark:bg-zinc-700 rounded px-1 py-0.5" {...props}>
        {children}
      </code>
    );
  },
  p: ({ children }: any) => <p className="mb-4 last:mb-0">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc ml-4 mb-4">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal ml-4 mb-4">{children}</ol>,
  li: ({ children }: any) => <li className="mb-1">{children}</li>,
  h1: ({ children }: any) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 my-4 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: any) => (
    <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  img: (props) => (
    <img
      {...props}
      loading="lazy"
      // @ts-ignore -- Skip crossorigin type error in production
      crossorigin="anonymous"
      className="rounded-lg max-w-full h-auto my-4"
    />
  ),
}; 