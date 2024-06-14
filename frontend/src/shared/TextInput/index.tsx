import { forwardRef, InputHTMLAttributes, useImperativeHandle, useRef } from 'react';

import styles from './TextInput.module.css';

type Props = {
  containerClassName?: string;
  type?: 'text' | 'password' | 'email';
  placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder'];
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
};

export type TextInputHandle = {
  focus: () => void;
};

const TextInput = forwardRef<TextInputHandle, Props>(function TextInput(
  { containerClassName = '', type = 'text', placeholder, value, onChange },
  ref,
) {
  useImperativeHandle(
    ref,
    () => ({
      focus() {
        inputRef.current?.focus();
      },
    }),
    [],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const onContainerClick = () => {
    const inputElement = inputRef.current;
    if (inputElement && document.activeElement !== inputElement) {
      inputElement.focus();
    }
  };

  return (
    <div className={`${styles.container} ${containerClassName}`} onClick={onContainerClick}>
      <input
        className={styles.input}
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

export default TextInput;
