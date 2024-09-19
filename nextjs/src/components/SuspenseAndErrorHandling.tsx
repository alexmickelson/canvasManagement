import { getErrorMessage } from "@/services/utils/queryClient";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { FC, ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "./Spinner";
import toast from "react-hot-toast";

export const SuspenseAndErrorHandling: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(props) => {
            toast.error(getErrorMessage(props.error));
            return (
              <div className="text-center">
                <div className="p-3">{getErrorMessage(props.error)}</div>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => props.resetErrorBoundary()}
                >
                  Try again
                </button>
              </div>
            );
          }}
        >
          <Suspense fallback={<Spinner />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
