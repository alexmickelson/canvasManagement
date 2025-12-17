import Link from "next/link";

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
        <Link className="btn" href={previousUrl} shallow={true}>
          Previous
        </Link>
      )}
      {nextUrl && (
        <Link className="btn" href={nextUrl} shallow={true}>
          Next
        </Link>
      )}
    </>
  );
}
