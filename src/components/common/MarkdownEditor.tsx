import MDEditor, { commands } from '@uiw/react-md-editor';

// 미리보기 기능은 <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />로 추가하세요

interface MarkdownEditorProps {
  value: string;
  setValue: (value: string) => void;
  height?: string;
  customStyle?: React.CSSProperties;
}

const MarkdownEditor = ({ value, setValue, height = "100%", customStyle }: MarkdownEditorProps) => {
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
        <MDEditor
            value={value}
            onChange={(value) => setValue(value || "")}
            height={height}
            preview="edit"
            visibleDragbar={false}
            commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.hr,
                commands.link,
                commands.quote,
                commands.code,
                commands.image,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.checkedListCommand,
                commands.table,
                commands.issue,
                commands.help,
            ]}
            extraCommands={[
                commands.codeEdit,
                commands.codeLive,
            ]}
            style={{
                flex: 1,
                height: height || "100%",
                minHeight: "300px",
                ...customStyle,
            }}
        />
    </div>
  );
}

export default MarkdownEditor;