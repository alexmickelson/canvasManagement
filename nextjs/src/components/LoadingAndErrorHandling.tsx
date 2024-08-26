import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { FC, ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// not at top level?
export const LoadingAndErrorHandling: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(props) => (
            <div className="text-center">
              <div className="p-3">{JSON.stringify(props.error)}</div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => props.resetErrorBoundary()}
              >
                Try again
              </button>
            </div>
          )}
        >
          <Suspense fallback={<div>loading...</div>}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
