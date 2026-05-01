import { Link } from "@tanstack/react-router";

export default function ItemNavigationButtons({
  previousUrl,
  nextUrl,
}: {
  previousUrl: string | null;
  nextUrl: string | null;
}) {
  return (
    <>
      {previousUrl && (
        <Link className="btn" to={previousUrl}>
          Previous
        </Link>
      )}
      {nextUrl && (
        <Link className="btn" to={nextUrl}>
          Next
        </Link>
      )}
    </>
  );
}
