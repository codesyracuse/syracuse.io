import { FullWidthLayout } from "../layout";

export default function Hero({ image, imageAlt, title, subtitle, cta }) {
  return (
    <FullWidthLayout>
      <div className="relative bg-gray-900 max-h-96">
        {/* Decorative image and overlay */}
        {image && (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 m-h-1/2 overflow-hidden"
            >
              <img
                className="h-full w-full object-cover object-center"
                src={image}
                alt={imageAlt}
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gray-600 opacity-25"
            />
          </>
        )}

        <div className="relative mx-auto flex max-w-3xl flex-col items-center py-32 px-6 text-center sm:py-32 lg:px-0">
          {title && (
            <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl text-white mt-4 lg:mt-6 lg:text-4xl">
              {subtitle}
            </p>
          )}
          {cta && (
            <a
              href={cta.url}
              className="mt-4 inline-block rounded-md border border-transparent bg-white py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              {cta.title}
            </a>
          )}
        </div>
      </div>
    </FullWidthLayout>
  );
}
