import { forwardRef, TextareaHTMLAttributes, useImperativeHandle, useRef } from 'react';

import styles from './TextArea.module.css';

type Props = {
  containerClassName?: string;
  placeholder?: TextareaHTMLAttributes<HTMLTextAreaElement>['placeholder'];
  value?: TextareaHTMLAttributes<HTMLTextAreaElement>['value'];
  onChange?: TextareaHTMLAttributes<HTMLTextAreaElement>['onChange'];
};

export type TextAreaHandle = {
  focus: () => void;
};

const TextArea = forwardRef<TextAreaHandle, Props>(function TextInput(
  { containerClassName = '', placeholder, value, onChange },
  ref,
) {
  useImperativeHandle(
    ref,
    () => ({
      focus() {
        textareaRef.current?.focus();
      },
    }),
    [],
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onContainerClick = () => {
    const inputElement = textareaRef.current;
    if (inputElement && document.activeElement !== inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div className={`${styles.container} ${containerClassName}`} onClick={onContainerClick}>
      <textarea
        className={styles.textarea}
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

export default TextArea;
