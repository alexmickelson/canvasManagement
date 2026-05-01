import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/course.$courseName.modules.$moduleName.assignment.$assignmentName.tsx
var $$splitComponentImporter = () => import("./course._courseName.modules._moduleName.assignment._assignmentName-CjQNiSwB.js");
var Route = createFileRoute("/course/$courseName/modules/$moduleName/assignment/$assignmentName")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
export { Route as t };
