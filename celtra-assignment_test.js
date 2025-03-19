Feature('celtra-assignment');

Scenario('creative filtering', ({ I }) => {
    // check if creatives = 3 initially
    I.amOnPage('/');
    I.waitForElement('.creative-variant', 10);
    I.seeNumberOfVisibleElements('.creative-variant', 3);
 
    // apply format filter and check if it's applied -> creatives = 1
    applyFilterAndCheckIfApplied(I, 'Format', '[data-id="universal-banner"]', 1);
 
    // apply size filter and check if it's applied -> creatives = 0 
    applyFilterAndCheckIfApplied(I, 'Size', '[data-id="320x50"]', 0);
 
    // clear filters and check if all creatives are visible again
    I.click('[data-testilda-id="filters-reset-button"]');
    I.seeNumberOfVisibleElements('.creative-variant', 3);
  });

Scenario('creative sorting', async  ({ I }) => {
   // check after loading page if its last modified sort 
   I.amOnPage('/');
   I.waitForElement('.creative-variant', 10);
   I.seeInField('.selectbox__current-item', 'Last modified creative');

   // verify that last modified first sort works
   // get last modified from API
   const creatives = await I.sendGetRequest('/creativeVariants?rootFolderId=1df8d540&isArchived=0&isDeleted=0&isEffectivelyArchived=0&folderClazz.in=Template,Campaign,SubFolder,Batch');
   const idsByDateModified = creatives.data.sort((a,b) => b.dateModified - a.dateModified).map(e=>e.creativeId)
   // get creatives from the UI
   const idsFromUi = await I.executeScript(() => {
       const elements = document.querySelectorAll('.creative-variant-metadata__properties__info > div:nth-child(2)');
       const ids = Array.from(elements).map(el => el.textContent.split(" ")[1]); // filter out undefined IDs
       return ids;
   });
   // compare array's to see if they match, if not print a error msg
    if (idsByDateModified.every((id, index) => id !== idsFromUi[index])) {
       throw new Error("The Creatives are not sorted by sort Last modified");
    }

   // change the sort -> larger to smaller
   I.click('.selectbox__current-item')
   I.click('Larger to smaller')
   I.waitForElement('.creative-variant', 10);
    
    // verify the sort works
    // sort creatives by size from largest to smallest from the API call
    const sortedBySize = creatives.data.sort((a, b) => {
       // Extract width and height from the sizeLabel string and calculate the area
       const [aWidth, aHeight] = a.sizeLabel.split('x').map(Number); 
       const [bWidth, bHeight] = b.sizeLabel.split('x').map(Number);
       return (bWidth * bHeight) - (aWidth * aHeight);}).map(e => e.sizeLabel); // Map to the sizeLabel string

   // get creatives from UI
   const sizeFromUi = await I.executeScript(() => {
       const elements = document.querySelectorAll('.creative-variant-metadata__properties__info > div:nth-child(1)');
   
       return Array.from(elements).map(el => el.textContent.split(" ")[0].trim().replace(/×/g, 'x')); 
   });

   // compare array's to see if they match, if not print a error msg
   if (sortedBySize.every((id, index) => id !== sizeFromUi[index])) {
       throw new Error("The Creatives are not sorted from Largest to smallest");
   }
});

Scenario('creative data validation' , async ({I}) => {
   I.amOnPage('/');
   I.waitForElement('.creative-variant', 10);
   const bannerTextExists = await I.executeScript(() => {
       // select all elements that contain creative size labels
       const elements = document.querySelectorAll(
           "#app > div > div.creative-explorer > div.creative-variants-list-wrapper > div > div.creative-variants-list--creatives > div > div > div.creative-variant__creative-unit.creative-variant__child--border-radius > div.creative-variant-metadata > div.creative-variant-metadata__properties.creative-variant-metadata__properties--subtitle > div.creative-variant-metadata__properties__info"
       );
   
       return Array.from(elements).some(el => {
           const text = el.textContent.trim();
           return text.includes("300×250") && text.includes("Banner");
       });
   });
   if (!bannerTextExists) {
       throw new Error('The text "Banner" is not displayed within the 300×250 – Universal Banner');
   }
});

function applyFilterAndCheckIfApplied(I, filterName, option, expectedCount) {
   I.click('[data-testilda-id="add-filter-button"]');
   I.click(`//span[text()="${filterName}"]`);
   I.click(option);
   I.waitForElement('.dialog-button:not([disabled])', 3);
   I.click('[data-testilda-id="dialog-button"]');
   I.seeNumberOfVisibleElements('.creative-variant', expectedCount);
}
