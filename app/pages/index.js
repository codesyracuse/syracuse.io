import * as resources from "./resources.mdx";
import * as community from "./community.mdx";

function pageFromModule(mod) {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ""),
    ...mod.attributes,
  };
}

const COMPONENTS = {
  community: community,
  resources: resources,
};

export const getPageAttributes = (slug) => {
  return pageFromModule(COMPONENTS[slug]);
};

export { community, resources };
