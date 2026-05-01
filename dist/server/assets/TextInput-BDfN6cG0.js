import "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/form/TextInput.tsx
function TextInput({ value, setValue, label, className, isTextArea = false, inputRef = void 0 }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "flex flex-col  " + className,
		children: [
			label,
			/* @__PURE__ */ jsx("br", {}),
			!isTextArea && /* @__PURE__ */ jsx("input", {
				className: "bg-slate-800 border border-slate-500 rounded-md w-full px-1",
				value,
				onChange: (e) => setValue(e.target.value),
				ref: inputRef
			}),
			isTextArea && /* @__PURE__ */ jsx("textarea", {
				className: "bg-slate-800 border border-slate-500 rounded-md w-full px-1 flex-grow",
				value,
				onChange: (e) => setValue(e.target.value)
			})
		]
	});
}
//#endregion
export { TextInput as t };
