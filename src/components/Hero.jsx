import { Image } from 'astro:assets';

export default function Hero({ image, title, altText, description, cta }) {
  return (
    <div className="relative min-h-[30svh] md:min-h-[60svh] max-h-svh bg-gray-500 flex items-center">
      {image && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden"
          >
            <img
              className="h-full w-full border-none object-cover object-center shadow-none"
              src={image}
              alt={altText}
            />
          </div>
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-neutral-800 opacity-20`}
          />
        </>
      )}

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center lg:px-0 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
        {title && (
          <h1 className="py-4 text-5xl font-extrabold tracking-tight text-white lg:text-6xl">
            {title}
          </h1>
        )}
        {description && (
          <>
            <hr className="w-32 h-1 my-0 bg-white border-0 rounded shadow-2xl bg-blend-darken shadow-black" />
            <div className="py-4 text-2xl font-bold text-white lg:text-4xl">
              {description}
            </div>
          </>
        )}
        {cta && (
          <a
            href={pagePath(cta)}
            className="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            {cta.title || cta.target?.title}
          </a>
        )}
      </div>
    </div>
  );
}
