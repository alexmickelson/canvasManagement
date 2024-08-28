import { LocalModule } from "@/models/local/localModules";
import React from "react";

export default function ExpandableModule({ module }: { module: LocalModule }) {
  return (
    <details>
      <summary> {module.name}</summary>
      expanded details
    </details>
  );
}
