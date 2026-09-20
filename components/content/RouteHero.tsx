interface RouteHeroProps {
  heading: string;
  description?: string;
  fileInputId?: string;
}

export function RouteHero({ heading, description, fileInputId }: RouteHeroProps) {
  return (
    <header className="route-hero">
      <h1>{heading}</h1>
      {fileInputId ? (
        <label className="button button-primary mobile-file-launcher" htmlFor={fileInputId}>
          Choose an image
        </label>
      ) : null}
      {description ? <p className="body-large">{description}</p> : null}
    </header>
  );
}
