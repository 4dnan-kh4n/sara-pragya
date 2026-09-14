import Link from "next/link";

export function BrandMark() {
  return (
    <Link className="brand-mark" href="/" aria-label="SARA-PRAGYA home">
      <svg aria-hidden="true" viewBox="0 0 42 42">
        <path d="M21 5C12 8 7 14 7 22c0 7 5 12 12 14 0-9 3-17 10-23-3 9-3 16 1 23 4-3 6-8 5-13C34 14 29 8 21 5Z" />
        <path d="M11 26c5-2 9-1 12 2s6 4 9 3" />
      </svg>
      <span>
        <strong>SARA-PRAGYA</strong>
        <small>Clinical research intelligence</small>
      </span>
    </Link>
  );
}
