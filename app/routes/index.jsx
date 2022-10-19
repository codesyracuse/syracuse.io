import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Hero from "~/components/Hero";
import Component, { attributes, filename } from "~/pages/home.mdx";

export default function Index() {
  console.log(attributes);
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
