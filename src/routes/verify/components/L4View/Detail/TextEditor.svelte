<script lang="ts">
  import { json } from '@codemirror/lang-json';
  import CodeMirror from 'svelte-codemirror-editor';

  export let contents = '';
</script>

<CodeMirror
  value={contents}
  lang={json()}
  readonly={true}
  styles={{
    '&': {
      width: '100%',
      maxWidth: '100%',
      height: 'calc(100vh - 400px)',
    },
    '.cm-content': {
      fontFamily: `'JetBrains Mono', monospace`,
      fontSize: '0.875rem',
    },
  }} />
