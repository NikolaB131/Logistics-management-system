import crypto from 'node:crypto';

import react from '@vitejs/plugin-react-swc';
import { CSSModulesOptions, defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let generateScopedName: CSSModulesOptions['generateScopedName'] = '[local]_[hash:base64:5]';

  if (mode === 'development') {
    generateScopedName = (className, filepath, css) => {
      const filename = filepath.slice(filepath.lastIndexOf('/') + 1, filepath.lastIndexOf('.module.css'));
      const hash = crypto.createHmac('sha1', filepath).update(css).digest('hex').substring(0, 5);
      return `${filename}_${className}__${hash}`;
    };
  }

  return {
    plugins: [react()],
    css: {
      modules: { generateScopedName },
    },
  };
});
