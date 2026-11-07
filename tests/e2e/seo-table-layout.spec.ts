import { test, expect } from '@playwright/test';
test('new metadata tables remain readable on phones', async ({page},testInfo)=>{
 for(const [route,caption] of [['/','Common names, file information, and cleanup scope'],['/supported-formats/','Reproducible file examples and their limits']]) {
  await page.goto(route);
  const table=page.locator('table').filter({has:page.locator('caption',{hasText:caption})});
  const cell=table.locator('tbody td').first();
  const mobile=(page.viewportSize()?.width??1000)<600;
  if(mobile) expect((await cell.boundingBox())!.width).toBeGreaterThan(280);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await table.screenshot({path:testInfo.outputPath(route==='/'?'home-table.png':'format-table.png')});
 }
});
