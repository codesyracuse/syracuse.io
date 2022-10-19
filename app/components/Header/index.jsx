import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserGroupIcon,
  CommandLineIcon,
  RectangleGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const solutions = [
  {
    name: "Community",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: UserGroupIcon,
  },
  {
    name: "Groups",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: RectangleGroupIcon,
  },
  {
    name: "Resources",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: CommandLineIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Header() {
  return (
    <Popover className="relative bg-stone-900">
      <div className="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10 border border-b-2 border-gray-500">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <a href="/" className="px-3 py-2 font-medium text-white ">
            <span className="hidden md:block text-base font-medium text-gray-200 hover:text-orange-200">
              syracuse.io
            </span>

            <span className="sr-only">Syracuse.io</span>
            <img
              className="block md:hidden h-8 w-auto sm:h-10"
              src="/images/syracuse-io-logo.svg"
              alt="logo"
            />
          </a>
        </div>
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-600 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <div className="absolute hidden md:block mt-6 left-1/2 -ml-1/2 z-50">
          <img
            className="h-24 w-48 mt-4 -ml-24"
            src="/images/syracuse-io-logo.svg"
            alt="Workflow logo"
          />
        </div>
        <div className="hidden items-center justify-end md:flex md:flex-1 md:flex-row lg:w-0 space-x-3">
          <a
            href="/community"
            className="whitespace-nowrap text-base font-medium text-gray-200 hover:text-orange-200"
          >
            community
          </a>
          <a
            href="/resources"
            className="whitespace-nowrap text-base font-medium text-gray-200 hover:text-orange-200"
          >
            resources
          </a>
          <a
            href="/groups"
            className="whitespace-nowrap text-base font-medium text-gray-200 hover:text-orange-200"
          >
            groups
          </a>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="/images/syracuse-io-logo.svg"
                    alt="logo"
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid grid-cols-1 gap-7">
                  {solutions.map((solution) => (
                    <a
                      key={solution.name}
                      href={solution.href}
                      className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-orange-500 text-white">
                        <solution.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-4 text-base font-medium text-gray-900">
                        {solution.name}
                      </div>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="mt-6">
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Looking for our slack group?{" "}
                  <a
                    href="/slack"
                    className="text-orange-600 hover:text-orange-500"
                  >
                    Join here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
