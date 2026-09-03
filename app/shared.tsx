import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { CapabilitySplit } from "@/components/content/CapabilitySplit";
import { EvidenceNote } from "@/components/content/EvidenceNote";
import { FaqAccordion } from "@/components/content/FaqAccordion";
import { GuideCardGrid } from "@/components/content/GuideCardGrid";
import { QuickAnswerCard } from "@/components/content/QuickAnswerCard";
import { RouteHero } from "@/components/content/RouteHero";
import { StepList } from "@/components/content/StepList";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RemoveAiLabelTool } from "@/components/tool/RemoveAiLabelTool";
import type { PageContent } from "@/content/pages";

export function renderContentPage(page: PageContent) {
  return (
    <div className="page-shell">
      <Header />
      <main className="main-shell" role="main">
        <div className="shell route-stack">
          {page.breadcrumbs ? <Breadcrumbs items={page.breadcrumbs} /> : null}
          <RouteHero heading={page.h1} description={page.description} />
          {page.quickAnswer ? <QuickAnswerCard answer={page.quickAnswer} /> : null}
          <div className="route-tool">
            <RemoveAiLabelTool />
          </div>
          {page.evidenceLabel ? <EvidenceNote text={page.evidenceLabel} /> : null}
          {page.whyTitle && page.whyPoints ? (
            <section>
              <h2>{page.whyTitle}</h2>
              <ul className="plain-list">
                {page.whyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {page.canCheck && page.cannotChange ? (
            <CapabilitySplit
              canTitle="What the Tool Can Check"
              canItems={page.canCheck}
              cannotTitle="What the Tool Cannot Change"
              cannotItems={page.cannotChange}
            />
          ) : null}
          {page.workflow ? (
            <StepList title="Step-by-Step Pre-Publish Workflow" steps={page.workflow} />
          ) : null}
          {page.verifySteps ? (
            <section>
              <h2>How to Verify the Cleaned File</h2>
              <ul className="plain-list">
                {page.verifySteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {page.misunderstandings ? (
            <section>
              <h2>Common Misunderstandings</h2>
              <ul className="plain-list">
                {page.misunderstandings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <FaqAccordion items={page.faqs} />
          {page.relatedGuides ? <GuideCardGrid title="Related Guides" items={page.relatedGuides} /> : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
