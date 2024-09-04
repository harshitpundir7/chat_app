import Link from "next/link";

export default function ({ link, text }: { link: string; text: string }) {
  return (
    <>
      {" "}
      <Link
        href={link}
        className="px-4 py-2 text-black dark:text-white rounded-2xl bg-purple-600 hover:bg-purple-500 transition-all duration-300"
      >
        {text}
      </Link>
    </>
  );
}
