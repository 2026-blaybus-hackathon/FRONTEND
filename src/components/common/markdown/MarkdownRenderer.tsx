import MDEditor from "@uiw/react-md-editor";
const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <div
      className="markdown-editor-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        
      }}
    >
        <MDEditor.Markdown
            source={markdown}
            style={{
                height: "auto",
                minHeight: "0",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
            }}
        />
    </div>
  );
}

export default MarkdownRenderer;