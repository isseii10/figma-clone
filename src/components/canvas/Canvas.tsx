"use client";

import {
  useMutation,
  useMyPresence,
  useSelf,
  useStorage,
} from "@liveblocks/react";
import {
  colorToCss,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "~/utils";
import LayerComponent from "./LayerComponent";
import {
  Camera,
  CanvasMode,
  CanvasState,
  EllipseLayer,
  Layer,
  LayerType,
  Point,
  RectangleLayer,
  Side,
  TextLayer,
  XYWH,
} from "~/types";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from "@liveblocks/core";
import React, { useCallback, useState } from "react";
import ToolsBar from "../toolsbar/ToolsBar";
import Path from "./Path";
import SelectionBox from "./SelectionBox";

const MAX_LAYERS = 100;

const Canvas = () => {
  const roomColor = useStorage((root) => root.roomColor);
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const presense = useMyPresence();
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }
      e.stopPropagation();
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] });
      }
      const point = pointerEventToCanvasPoint(e, camera);
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState.mode, camera],
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      setCanvasState({ mode: CanvasMode.Resizing, initialBounds, corner });
    },
    [],
  );

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text,
      position: Point,
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }
      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      let layer: LiveObject<Layer> | null = null;

      if (layerType === LayerType.Rectangle) {
        layer = new LiveObject<RectangleLayer>({
          type: LayerType.Rectangle,
          x: position.x,
          y: position.y,
          width: 100,
          height: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,
        });
      } else if (layerType === LayerType.Ellipse) {
        layer = new LiveObject<EllipseLayer>({
          type: LayerType.Ellipse,
          x: position.x,
          y: position.y,
          width: 100,
          height: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,
        });
      } else if (layerType === LayerType.Text) {
        layer = new LiveObject<TextLayer>({
          type: LayerType.Text,
          x: position.x,
          y: position.y,
          height: 100,
          width: 100,
          fontSize: 16,
          text: "Text",
          fontWeight: 400,
          fontFamily: "Inter",
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,
        });
      }

      if (layer) {
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
    },
    [],
  );

  const insertPath = useMutation(({ storage, self, setMyPresence }) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft } = self.presence;

    if (
      pencilDraft === null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null });
      return;
    }

    const id = nanoid();
    liveLayers.set(
      id,
      new LiveObject(
        penPointsToPathLayer(pencilDraft, { r: 217, g: 217, b: 217 }),
      ),
    );

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);
    setMyPresence({ pencilDraft: null });
    setCanvasState({ mode: CanvasMode.Pencil });
  }, []);

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }
      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      );

      const liveLayers = storage.get("layers");

      if (self.presence.selection.length > 0) {
        const layer = liveLayers.get(self.presence.selection[0]!);
        if (layer) {
          layer.update(bounds);
        }
      }
    },
    [canvasState],
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] });
    }
  }, []);

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: { r: 217, g: 217, b: 217 },
      });
    },
    [],
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 || // 1: left button
        pencilDraft === null
      ) {
        return;
      }

      setMyPresence({
        pencilDraft: [...pencilDraft, [point.x, point.y, e.pressure]],
        penColor: { r: 217, g: 217, b: 217 },
      });
    },
    [canvasState.mode],
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
      zoom: camera.zoom,
    }));
  }, []);

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.None) {
        unselectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else if (canvasState.mode === CanvasMode.Dragging) {
        setCanvasState({ mode: CanvasMode.Dragging, origin: null });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }
    },
    [canvasState, setCanvasState, insertLayer],
  );

  const onPointerDown = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Dragging) {
        setCanvasState({ mode: CanvasMode.Dragging, origin: point });
        return;
      }
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
    },
    [camera, canvasState.mode, setCanvasState, startDrawing],
  );

  const onPointerMove = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (
        canvasState.mode === CanvasMode.Dragging &&
        canvasState.origin !== null
      ) {
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        setCamera((camera) => ({
          x: camera.x + deltaX,
          y: camera.y + deltaY,
          zoom: camera.zoom,
        }));
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(point, e);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(point);
      }
    },
    [camera, setCamera, canvasState, continueDrawing, resizeSelectedLayer],
  );

  return (
    <div className="flex h-screen w-full">
      <main className="fixed left-0 right-0 h-screen overflow-auto">
        <div
          style={{
            backgroundColor: roomColor ? colorToCss(roomColor) : "#1e1e1e",
          }}
          className="h-full w-full touch-none"
        >
          <svg
            onWheel={onWheel}
            onPointerUp={onPointerUp}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            className="h-full w-full"
          >
            <g
              style={{
                transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
              }}
            >
              {layerIds?.map((layerId) => (
                <LayerComponent
                  key={layerId}
                  id={layerId}
                  onLayerPointerDown={onLayerPointerDown}
                />
              ))}
              <SelectionBox
                onResizeHandlePointerDown={onResizeHandlePointerDown}
              />
              {pencilDraft !== null && pencilDraft.length > 0 && (
                <Path
                  x={0}
                  y={0}
                  fill={colorToCss({ r: 217, g: 217, b: 217 })}
                  opacity={100}
                  points={pencilDraft}
                />
              )}
            </g>
          </svg>
        </div>
      </main>
      <ToolsBar
        canvasState={canvasState}
        setCanvasState={(newState) => setCanvasState(newState)}
        zoomIn={() => {
          setCamera((camera) => ({ ...camera, zoom: camera.zoom + 0.1 }));
        }}
        zoomOut={() => {
          setCamera((camera) => ({ ...camera, zoom: camera.zoom - 0.1 }));
        }}
        canZoomIn={camera.zoom < 2}
        canZoomOut={camera.zoom > 0.5}
      />
    </div>
  );
};

export default Canvas;
