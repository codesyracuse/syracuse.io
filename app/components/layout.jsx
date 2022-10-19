export function Layout(props) {
  return (
    <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
      {props.children}
    </div>
  );
}

export function FullWidthLayout(props) {
  return <div className="mx-auto z-0">{props.children}</div>;
}
