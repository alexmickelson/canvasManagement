import { FC, ReactNode } from "react";

export const EditLayout: FC<{
  Header: ReactNode;
  Body: ReactNode;
  Footer: ReactNode;
}> = ({ Header, Body, Footer }) => {
  return (
    <div className="h-full flex flex-col align-middle px-1 max-w-[2400px] mx-auto bg-gray-900 rounded">
      {Header}
      <div className="min-h-0 flex flex-row w-full flex-grow">
        {Body}
      </div>
      {Footer}
    </div>
  );
};
