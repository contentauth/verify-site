<script lang="ts">
  import { json } from '@codemirror/lang-json';
  import CodeMirror from 'svelte-codemirror-editor';

  export let contents = '';
  export let syntax: 'json' | undefined = undefined;
  let lang: any = undefined;

  $: {
    if (syntax === 'json') {
      lang = json();
    }
  }
</script>

<CodeMirror
  value={contents}
  {lang}
  readonly={true}
  styles={{
    '&': {
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
    },
    '.cm-content': {
      fontFamily: `'JetBrains Mono', monospace`,
      fontSize: '0.8125rem',
    },
  }} />
