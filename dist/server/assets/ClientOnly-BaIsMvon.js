import { useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx } from "react/jsx-runtime";
//#region src/components/ClientOnly.tsx
function ClientOnly({ children }) {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);
	if (!isClient) return /* @__PURE__ */ jsx(Fragment$1, {});
	return /* @__PURE__ */ jsx(Fragment$1, { children });
}
//#endregion
export { ClientOnly as t };
