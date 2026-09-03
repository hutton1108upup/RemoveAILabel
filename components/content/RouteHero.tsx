interface RouteHeroProps {
  heading: string;
  description?: string;
}

export function RouteHero({ heading, description }: RouteHeroProps) {
  return (
    <header className="route-hero">
      <h1>{heading}</h1>
      {description ? <p className="body-large">{description}</p> : null}
    </header>
  );
}
