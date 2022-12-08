import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { community, resources, getPageAttributes } from "~/pages/";
import Hero from "~/components/Hero";

const PAGES = {
  community: community.default,
  resources: resources.default,
};

export const loader = ({ params }) => {
  const slug = params.pageId;
  const attributes = getPageAttributes(slug);

  return json({ slug, ...attributes });
};

export default function Index() {
  const attributes = useLoaderData();
  const Component = PAGES[attributes.slug];

  return (
    <>
      {attributes.title && <Hero {...attributes} />}
      <div className="relative overflow-hidden bg-white py-16">
        <div
          className="relative mx-auto h-full max-w-prose text-lg"
          aria-hidden="true"
        >
          <div className="prose prose-orange  md:prose-lg lg:prose-xl px-4">
            <Component {...attributes} />
          </div>
        </div>
      </div>
    </>
  );
}
