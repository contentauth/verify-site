// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

export type Disposable<T> = {
  // Disposer function that should be called when this resource is no longer being used
  dispose: () => void;
} & T;

type LoadableStateNone = {
  state: 'none';
};

type LoadableStateLoading = {
  state: 'loading';
};

type LoadableStateSuccess<T> = { state: 'success' } & T;

export type Loadable<T> =
  | LoadableStateNone
  | LoadableStateLoading
  | LoadableStateSuccess<T>;
