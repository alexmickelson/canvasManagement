import { LocalModule } from "@/models/local/localModules";
import React from "react";

export default function ExpandableModule({ module }: { module: LocalModule }) {
  return (
    <>
      <section className="">
        <label>
          <div
            className="
            max-h-14 max-w-xs
            overflow-hidden 
            rounded-lg
            bg-slate-800 
            px-4 py-0 mb-3
            transition-all duration-500 
            peer-checked/showLabel:max-h-screen
          "
          >
            <div className="flex h-14 cursor-pointer items-center font-bold">
              <input
                className="peer/showLabel absolute scale-0"
                type="checkbox"
              />
              {module.name}
            </div>
            <hr />
            <p className="mb-2">
              crafted a sleek collapsible panel using Tailwind CSS without the
              need for JavaScript. Impressive! 😎
            </p>
          </div>
        </label>
      </section>
    </>
  );
}
