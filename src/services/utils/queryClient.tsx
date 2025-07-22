import toast, { CheckmarkIcon } from "react-hot-toast";
import { ReactNode } from "react";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { TRPCError } from "@trpc/server";

// const addErrorAsToast = async (error: unknown) => {
//   console.error("error from toast", error);
//   const message = getErrorMessage(error);

//   toast(
//     (t) => (
//       <div className="row">
//         <div className="col-auto my-auto">
//           <ErrorIcon />
//         </div>
//         <div className="col my-auto">
//           <div className="white-space">{message}</div>
//           <div>
//             <a
//               href="https://snow.kualibuild.com/app/651eeebc32976c013a4c4739/run"
//               target="_blank"
//               rel="noreferrer"
//             >
//               Report Bug
//             </a>
//           </div>
//         </div>
//         <div className="col-auto my-auto">
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="btn btn-outline-secondary btn-sm"
//           >
//             <i className="bi bi-x"></i>
//           </button>
//         </div>
//       </div>
//     ),
//     {
//       duration: Infinity,
//     }
//   );
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any) {
  if (error instanceof TRPCError) {
    const httpCode = getHTTPStatusCodeFromError(error);
    console.log("trpc error", httpCode, error); // 400
    return `TRPC Error: ${error.message} (HTTP ${httpCode})`;
  }

  if (error?.response?.status === 422) {
    console.log(error.response.data.detail);
    const serializationMessages = error.response.data.detail.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (d: any) => `${d.type} - ${d.loc[1]}`
    );
    return `Deserialization error on request:\n${serializationMessages.join(
      "\n"
    )}`;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error.response?.data.detail) {
    if (typeof error.response?.data.detail === "string") {
      return error.response?.data.detail;
    } else return JSON.stringify(error.response?.data.detail);
  }
  console.log("error message: ", error);
  if(error.message )
    return error.message;
  return "Error With Request";
}

export function createInfoToast(
  children: ReactNode,
  onClose: () => void = () => {}
) {
  toast(
    (t) => (
      <div className="row">
        <div className="col-auto my-auto">
          <i className="bi bi-info-circle-fill"></i>
        </div>
        <div className="col my-auto">{children}</div>
        <div className="col-auto my-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onClose();
            }}
            className="btn btn-outline-secondary py-1"
          >
            <i className="bi-x-lg" />
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        maxWidth: "75em",
      },
    }
  );
}

export function createSuccessToast(message: string) {
  toast(
    (t) => (
      <div className="row">
        <div className="col-auto my-auto">
          <CheckmarkIcon />
        </div>
        <div className="col my-auto"> {message}</div>
        <div className="col-auto my-auto">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn btn-outline-secondary py-1"
          >
            <i className="bi-x-lg" />
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        maxWidth: "75em",
      },
    }
  );
}
