import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });
  
  console.log("Navigating to http://localhost:5173...");
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log("Page loaded.");
  } catch (err) {
    console.log("Navigation failed:", err.message);
  }
  
  await browser.close();
  console.log("Done.");
})();
