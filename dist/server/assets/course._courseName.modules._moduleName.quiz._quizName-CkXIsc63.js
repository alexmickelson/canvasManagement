import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/course.$courseName.modules.$moduleName.quiz.$quizName.tsx
var $$splitComponentImporter = () => import("./course2._courseName.modules._moduleName.quiz._quizName-Brtj-bHv.js");
var Route = createFileRoute("/course/$courseName/modules/$moduleName/quiz/$quizName")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
export { Route as t };
