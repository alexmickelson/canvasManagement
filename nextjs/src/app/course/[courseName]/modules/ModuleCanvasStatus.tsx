"use client";
import { Spinner } from "@/components/Spinner";
import {
  useAddCanvasModuleMutation,
  useCanvasModulesQuery,
} from "@/hooks/canvas/canvasModuleHooks";

export function ModuleCanvasStatus({ moduleName }: { moduleName: string }) {
  const { data: canvasModules } = useCanvasModulesQuery();
  const addToCanvas = useAddCanvasModuleMutation();

  const canvasModule = canvasModules.find((c) => c.name === moduleName);

  return (
    <div className="text-slate-400 text-end">
      {!canvasModule && <div>Not in Canvas</div>}
      {!canvasModule && (
        <button
          disabled={addToCanvas.isPending}
          onClick={() => addToCanvas.mutate(moduleName)}
        >
          {addToCanvas.isPending ? <Spinner /> : <div>Add</div>}
        </button>
      )}
      {canvasModule && !canvasModule.published && <div>Not Published</div>}
      {canvasModule && canvasModule.published && <div>Published</div>}
    </div>
  );
}
