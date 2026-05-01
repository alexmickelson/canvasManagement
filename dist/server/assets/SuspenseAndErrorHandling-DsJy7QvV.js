import { Suspense } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { TRPCError } from "@trpc/server";
import { ErrorBoundary } from "react-error-boundary";
//#region src/services/serverFunctions/trpcClient.ts
var trpc = createTRPCReact();
var { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext();
//#endregion
//#region src/services/utils/queryClient.tsx
function getErrorMessage(error) {
	if (error instanceof TRPCError) {
		const httpCode = getHTTPStatusCodeFromError(error);
		console.log("trpc error", httpCode, error);
		return `TRPC Error: ${error.message} (HTTP ${httpCode})`;
	}
	if (error?.response?.status === 422) {
		console.log(error.response.data.detail);
		return `Deserialization error on request:\n${error.response.data.detail.map((d) => `${d.type} - ${d.loc[1]}`).join("\n")}`;
	}
	if (typeof error === "string") return error;
	if (error.response?.data.detail) if (typeof error.response?.data.detail === "string") return error.response?.data.detail;
	else return JSON.stringify(error.response?.data.detail);
	console.log("error message: ", error);
	if (error.message) return error.message;
	return "Error With Request";
}
//#endregion
//#region src/components/Spinner.tsx
var Spinner = () => {
	return /* @__PURE__ */ jsx("div", {
		className: "text-center h-full ",
		children: /* @__PURE__ */ jsx("span", { className: "loader my-auto " })
	});
};
//#endregion
//#region src/components/SuspenseAndErrorHandling.tsx
var SuspenseAndErrorHandling = ({ children, showToast = true }) => {
	return /* @__PURE__ */ jsx(QueryErrorResetBoundary, { children: ({ reset }) => /* @__PURE__ */ jsx(ErrorBoundary, {
		onReset: reset,
		fallbackRender: (props) => {
			if (showToast) toast.error(getErrorMessage(props.error));
			return /* @__PURE__ */ jsxs("div", {
				className: "text-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: "p-3",
					children: getErrorMessage(props.error)
				}), /* @__PURE__ */ jsx("button", {
					className: "btn btn-outline-secondary",
					onClick: () => props.resetErrorBoundary(),
					children: "Try again"
				})]
			});
		},
		children: /* @__PURE__ */ jsx(Suspense, {
			fallback: /* @__PURE__ */ jsx(Spinner, {}),
			children
		})
	}) });
};
//#endregion
export { useTRPC as a, trpc as i, Spinner as n, TRPCProvider as r, SuspenseAndErrorHandling as t };
