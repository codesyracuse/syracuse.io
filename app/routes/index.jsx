import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Hero from "~/components/Hero";
import Component, { attributes, filename } from "~/pages/home.mdx";


import { useLoaderData } from '@remix-run/react';

// type definitions
type Book = {
  title: string;
  genre: string;
};
type Books = Array<Book>;
type LoaderData = {
  books: Books;
};

// Loader function
export const loader = async () => {
  return json<LoaderData>({
    books: [
      {
        title: 'Harry Potter and the Deathly Hallows',
        genre: "Children's Fiction",
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        genre: "Children's Fiction",
      },
    ],
  });
};

export default function Index() {
  sonsole.log(attributes);
  const { books } = useLoaderData() as LoaderData;

  return (
    <>
      {attributes.title && <Hero {...attributes} />}
      <div className="relative overflow-hidden bg-white py-16">
        <div
          className="relative mx-auto h-full max-w-prose text-lg"
          aria-hidden="true"
        >
          <div className="prose prose-orange  md:prose-lg lg:prose-xl px-4">
            <Component />
          </div>
        </div>
      </div>
    </>
  );
}
