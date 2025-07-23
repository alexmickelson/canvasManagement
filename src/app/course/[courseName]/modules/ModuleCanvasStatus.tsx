"use client";
import CheckIcon from "@/components/icons/CheckIcon";
import { Spinner } from "@/components/Spinner";
import {
  useCanvasModulesQuery,
  useAddCanvasModuleMutation,
} from "@/features/canvas/hooks/canvasModuleHooks";

export function ModuleCanvasStatus({ moduleName }: { moduleName: string }) {
  const { data: canvasModules } = useCanvasModulesQuery();
  const addToCanvas = useAddCanvasModuleMutation();

  const canvasModule = canvasModules?.find((c) => c.name === moduleName);

  return (
    <div className="text-slate-400 text-end">
      {!canvasModule && <div className="text-rose-400">Not in Canvas</div>}
      {!canvasModule && (
        <button
          disabled={addToCanvas.isPending}
          onClick={() => addToCanvas.mutate(moduleName)}
        >
          {addToCanvas.isPending ? <Spinner /> : <div>Add</div>}
        </button>
      )}
      {canvasModule && !canvasModule.published && <div>Not Published</div>}
      {canvasModule && canvasModule.published && (
        <div>
          <CheckIcon />
        </div>
      )}
    </div>
  );
}
