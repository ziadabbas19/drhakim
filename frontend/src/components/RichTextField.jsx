import { useLayoutEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n.js';
import { cn } from '../utils/cn.js';
import { Button } from './Button.jsx';
import { FieldShell } from './FormField.jsx';
import { Icon } from './Icon.jsx';

const COMMANDS = Object.freeze([
  { command: 'bold', icon: 'bold', label: 'editor.bold' },
  { command: 'italic', icon: 'italic', label: 'editor.italic' },
  { command: 'insertUnorderedList', icon: 'list', label: 'editor.bulletList' },
  { command: 'insertOrderedList', icon: 'listOrdered', label: 'editor.numberedList' },
]);

const RichTextEditor = ({ id, labelId, describedBy, invalid, required, value, onChange, dir, lang }) => {
  const { t } = useI18n();
  const editorRef = useRef(null);

  // The editor owns its content while typing; a new value from outside (loading, reset) replaces it.
  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (editor.innerHTML !== value) editor.innerHTML = value ?? '';
  }, [value]);

  const emit = () => onChange(editorRef.current.innerHTML);

  const run = (command) => {
    editorRef.current.focus();
    document.execCommand(command);
    emit();
  };

  // Pasted text keeps no outside formatting.
  const pastePlainText = (event) => {
    event.preventDefault();
    document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line-strong bg-surface focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15',
        invalid && 'border-danger focus-within:border-danger focus-within:ring-danger/15',
      )}
    >
      <div
        role="toolbar"
        aria-label={t('editor.toolbar')}
        className="flex gap-1 border-b border-line bg-surface-muted p-1"
      >
        {COMMANDS.map(({ command, icon, label }) => (
          <Button
            key={command}
            variant="ghost"
            size="icon"
            aria-label={t(label)}
            title={t(label)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => run(command)}
          >
            <Icon name={icon} className="size-4.5" />
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-required={required || undefined}
        contentEditable
        suppressContentEditableWarning
        dir={dir}
        lang={lang}
        onInput={emit}
        onPaste={pastePlainText}
        className="rich-text min-h-40 px-3.5 py-2.5 text-base text-ink focus:outline-none"
      />
    </div>
  );
};

export const RichTextField = ({ label, error, hint, required, className, ...editorProps }) => (
  <FieldShell label={label} error={error} hint={hint} required={required} className={className}>
    {(ids) => <RichTextEditor {...ids} describedBy={ids.messageId} required={required} {...editorProps} />}
  </FieldShell>
);
