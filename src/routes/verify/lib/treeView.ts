// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import { analytics } from '$src/lib/analytics';
import { ROOT_ID, type AssetData } from '$src/lib/asset';
import { prefersReducedMotion } from '$src/lib/matchMedia';
import { hierarchy as d3Hierarchy, tree as d3Tree } from 'd3-hierarchy';
import type { Selection } from 'd3-selection';
import { zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { get, type Readable } from 'svelte/store';
import type { ReadableAssetStore } from '../stores/asset';
import type { ReadableAssetMap } from '../stores/hierarchyView';

export type SVGSelection = Selection<
  SVGElement,
  ReadableAssetStore,
  null,
  undefined
>;

export interface TreeViewConfig {
  margin: number;
  nodeWidth: number;
  nodeHeight: number;
  hPad: number;
  vPad: number;
}

export interface ComponentDims {
  width: number;
  height: number;
}

export const defaultConfig: TreeViewConfig = {
  margin: 0.95,
  hPad: 40,
  vPad: 50,
  nodeHeight: 100,
  nodeWidth: 100,
};

export interface CreateTreeViewProps {
  assetStoreMap: ReadableAssetMap;
  selectedAsset: Readable<AssetData>;
  config: Partial<TreeViewConfig>;
  svgElement: SVGElement;
  boundsElement: SVGGraphicsElement;
  dims: ComponentDims;
}

export function remToPx(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getMinScale(
  boundsElement: SVGGraphicsElement | undefined,
  margin: number,
  width: number,
  height: number,
) {
  const bbox = boundsElement?.getBBox();

  if (bbox) {
    const xRatio = bbox.width / width;
    const yRatio = bbox.height / height;

    return Math.min(1, margin / Math.max(xRatio, yRatio));
  }

  return 1;
}

export interface CreateTreeProps {
  assetStoreMap: ReadableAssetMap;
  width: number;
  height: number;
  config: TreeViewConfig;
}

export function createTree({
  assetStoreMap,
  width,
  height,
  config,
}: CreateTreeProps) {
  const { nodeWidth, nodeHeight, vPad, hPad } = config;
  const hierarchy = d3Hierarchy(assetStoreMap[ROOT_ID], (readableAsset) => {
    const assetData = get(readableAsset);
    const childrenIds = assetData.children;

    return childrenIds ? childrenIds.map((id) => assetStoreMap[id]) : [];
  });
  const d3tree = d3Tree<ReadableAssetStore>();
  d3tree.size([width, height]);
  d3tree.nodeSize([nodeWidth + vPad, nodeHeight + hPad]);
  d3tree.separation((a, b) => (a.parent == b.parent ? 1 : 1));

  return d3tree(hierarchy);
}

interface CreateTransformsProps {
  boundsElement: SVGGraphicsElement;
  boundsTransform: ZoomTransform;
  width: number;
  height: number;
  margin: number;
}

export interface Transforms {
  tx: number;
  ty: number;
  scale: number;
  gTransform: string;
  htmlTransform: string;
  minScale: number;
  minZoomScale: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export function calculateTransforms({
  boundsElement,
  boundsTransform,
  width,
  height,
  margin,
}: CreateTransformsProps): Transforms {
  const tx = boundsTransform?.x ?? 0;
  const ty = boundsTransform?.y ?? 0;
  const scale = boundsTransform?.k ?? 0;
  const minScale = 0.0625;

  return {
    tx,
    ty,
    scale,
    gTransform: `translate(${tx}, ${ty}) scale(${scale})`,
    htmlTransform: `translate3d(${tx}px, ${ty}px, 0) scale3d(${scale}, ${scale}, 1)`,
    minScale,
    minZoomScale: getMinScale(boundsElement, margin, width, height / 2),
    canZoomIn: scale < 1,
    canZoomOut: scale > 0.0625,
  };
}

export function createLinks(
  tree: ReturnType<typeof createTree>,
  // We are including this so it can reactively update
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _selectedAsset: AssetData,
) {
  return (
    tree
      .links()
      .map((link, idx) => {
        const { source, target } = link;
        const isAncestor =
          get(source.data).state !== 'none' &&
          get(target.data).state !== 'none';

        return { link, idx, isAncestor };
      })
      // Make sure the highlighted (ancestor) paths appear on top
      .sort((a, b) => {
        if (a.isAncestor && !b.isAncestor) {
          return 1;
        }

        if (!a.isAncestor && b.isAncestor) {
          return -1;
        }

        return 0;
      })
  );
}

interface ZoomInProps {
  svgSel: SVGSelection;
  zoom: ZoomBehavior<SVGElement, ReadableAssetStore>;
}

export function zoomIn({ svgSel, zoom }: ZoomInProps, currentScale: number) {
  analytics.track('treeViewZoom', { dir: 'in' });
  currentScale *= 2;
  console.log('current in', currentScale);
  zoom.scaleTo(
    svgSel.transition().duration(prefersReducedMotion ? 0 : 250),
    currentScale,
  );

  return currentScale;
}

interface ZoomOutProps extends ZoomInProps {
  boundsElement: SVGGraphicsElement;
  width: number;
  height: number;
  minZoomScale: number;
}

export function zoomOut(
  { svgSel, zoom, boundsElement, width, height }: ZoomOutProps,
  currentScale: number,
) {
  analytics.track('treeViewZoom', { dir: 'out' });
  const sel = svgSel.transition().duration(prefersReducedMotion ? 0 : 250);
  const bbox = boundsElement.getBBox();
  currentScale = currentScale / 2;
  console.log('current', currentScale);

  sel.call(
    zoom.transform,
    zoomIdentity
      .translate(width / 2, height / 2)
      .scale(currentScale)
      .translate(
        -(bbox.x * 2 + bbox.width) / 2,
        -(bbox.y * 6 + bbox.height) / 2,
      ),
  );

  return currentScale;
}
