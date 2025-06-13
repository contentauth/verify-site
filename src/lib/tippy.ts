// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Props as TippyProps } from 'tippy.js';
import tippyjs, { followCursor } from 'tippy.js';

const defaultProps: Partial<TippyProps> = {
  allowHTML: true,
  placement: 'top',
  theme: 'cai',
  plugins: [followCursor],
};

interface ITippyOpts {
  hasPadding: boolean;
}

const defaultOpts: ITippyOpts = {
  hasPadding: true,
};

export function tippy(
  node: HTMLElement,
  props: Partial<TippyProps>,
  options?: Partial<ITippyOpts>,
) {
  const { content, ...tippyProps } = props;
  const opts = { ...defaultOpts, ...options };
  const contentHTML =
    opts.hasPadding && !(content instanceof HTMLElement)
      ? `<div class="p-3">${content}</div>`
      : content;

  return tippyjs(node, {
    ...defaultProps,
    ...tippyProps,
    content: contentHTML,
  });
}

export type { ReferenceElement, Props as TippyProps } from 'tippy.js';
