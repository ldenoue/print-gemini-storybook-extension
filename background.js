

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      /**
       * Creates a PDF-like document from Storybook content by opening a new window
       * and populating it with formatted content including cover page and story pages.
       * This function orchestrates the entire PDF creation process.
       * 
       * @function createStorybookPDF
       * @returns {void}
       * 
       * @example
       * createStorybookPDF(); // Opens new window with formatted Storybook content
       */
      const createStorybookPDF = () => {
        const title = getStorybookTitle();
        const newWindow = openNewWindow(title);
        const document = newWindow.document;
        
        const body = setupDocument(document);
        createCoverPage(body, title);
        createContentPages(body);
        applyDropCaseStyling(body);
        
        document.close();
      };

      /**
       * Extracts the title from the Storybook cover page.
       * Searches for the cover title element and returns its text content.
       * 
       * @function getStorybookTitle
       * @returns {string} The storybook title or 'Untitled' if not found
       * 
       * @example
       * const title = getStorybookTitle(); // Returns "My Storybook" or "Untitled"
       */
      const getStorybookTitle = () => {
        return document.querySelector('.cover-title')?.textContent || 'Untitled';
      };

      /**
       * Opens a new browser window for the PDF document.
       * Creates a blank window with the specified title.
       * 
       * @function openNewWindow
       * @param {string} title - The title to set for the new window
       * @returns {Window} The newly created window object
       * 
       * @example
       * const newWindow = openNewWindow("My Storybook PDF");
       */
      const openNewWindow = (title) => {
        const newWindow = window.open('', '_blank');
        newWindow.document.title = title;
        return newWindow;
      };

      /**
       * Sets up the document structure in the new window.
       * Creates the body element and applies basic styling and CSS.
       * 
       * @function setupDocument
       * @param {Document} document - The document object to set up
       * @returns {HTMLBodyElement} The configured body element
       * 
       * @example
       * const body = setupDocument(newWindow.document);
       */
      const setupDocument = (document) => {
        document.open();
        
        const body = document.createElement('body');
        body.style = 'margin:0; padding:0';
        
        const styles = createStyles();
        body.appendChild(styles);
        
        document.appendChild(body);
        return body;
      };

      /**
       * Creates and returns a style element containing CSS for the PDF layout.
       * Defines styles for page containers, images, text, and special effects.
       * 
       * @function createStyles
       * @returns {HTMLStyleElement} The style element with embedded CSS
       * 
       * @example
       * const styles = createStyles();
       * document.head.appendChild(styles);
       */
      const createStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .page-container {
            display: flex;
            border-radius: 20px;
            width: 29.7cm;
            height: 21cm;
            margin: auto;
            border: 1px solid black;
            box-sizing: border-box;
          }
          
          .page-container img {
            margin: auto;
            display: block;
            height: -webkit-fill-available;
            border-radius: 20px 0px 0px 20px;
            padding: 0px;
          }
          
          .page-container p {
            margin: auto;
            max-width: 80%;
            display: block;
            padding: 80px;
            border-radius: 0 20px 20px 0;
            font: 22pt serif;
          }

          .page-container.drop-case p:first-letter {
            float: inline-start;
            margin-top: 3px;
            font-size: 3.75rem;
            line-height: 3.75rem;
            -webkit-margin-end: 12px;
            -moz-margin-end: 12px;
            margin-inline-end: 12px;
            -webkit-margin-before: 3px;
            margin-block-start: 3px;
          }
          
          .cover-container {
            display: block;
            overflow: hidden;
          }
          
          .cover-container h2 {
            display: block;
            position: relative;
            margin: auto;
            text-align: center;
            transform: translate(0, -1000px);
            font-size: 50px;
            background-color: wheat;
            padding: 20px;
            width: 100%;
          }
          
          .cover-container img {
            margin: auto;
            display: block;
            text-align: center;
            width: 100%;
            height: unset;
            position: relative;
            top: -200px;
          }
        `;
        
        return styleElement;
      };

      /**
       * Creates the cover page for the PDF document.
       * Builds a cover page container with image and title elements.
       * 
       * @function createCoverPage
       * @param {HTMLBodyElement} body - The body element to append the cover page to
       * @param {string} title - The title text to display on the cover
       * @returns {void}
       * 
       * @example
       * createCoverPage(document.body, "My Storybook");
       */
      const createCoverPage = (body, title) => {
        const container = document.createElement('div');
        body.appendChild(container);
        
        const coverContainer = document.createElement('div');
        coverContainer.classList.add('cover-container', 'page-container');
        
        const coverImage = createCoverImage();
        const titleElement = createTitleElement(title);
        
        coverContainer.appendChild(coverImage);
        coverContainer.appendChild(titleElement);
        container.appendChild(coverContainer);
      };

      /**
       * Creates the cover image element by extracting the source from Storybook.
       * Searches for the cover page image and creates an img element.
       * 
       * @function createCoverImage
       * @returns {HTMLImageElement} The cover image element
       * 
       * @example
       * const coverImg = createCoverImage();
       */
      const createCoverImage = () => {
        const coverImageSrc = document.querySelector('storybook-cover-page-content img')?.src;
        const coverImage = document.createElement('img');
        coverImage.src = coverImageSrc;
        return coverImage;
      };

      /**
       * Creates the title element for the cover page.
       * Builds an h2 element with the specified title text.
       * 
       * @function createTitleElement
       * @param {string} title - The title text to display
       * @returns {HTMLHeadingElement} The title heading element
       * 
       * @example
       * const titleEl = createTitleElement("My Storybook Title");
       */
      const createTitleElement = (title) => {
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        return titleElement;
      };

      /**
       * Creates content pages for all story content.
       * Iterates through available pages and creates formatted containers for each.
       * 
       * @function createContentPages
       * @param {HTMLBodyElement} body - The body element to append content pages to
       * @returns {void}
       * 
       * @example
       * createContentPages(document.body);
       */
      const createContentPages = (body) => {
        const pages = getContentPages();
        
        for (const page of pages) {
          const pageData = extractPageData(page);
          
          if (pageData.hasValidContent()) {
            const pageContainer = createPageContainer(pageData);
            body.appendChild(pageContainer);
          }
        }
      };

      /**
       * Retrieves all content pages from the Storybook.
       * Attempts to find pages using different selectors for compatibility.
       * 
       * @function getContentPages
       * @returns {NodeList} Collection of page elements
       * 
       * @example
       * const pages = getContentPages();
       * console.log(`Found ${pages.length} pages`);
       */
      const getContentPages = () => {
        let pages = document.querySelectorAll('.page:not([class*="cover"])');
        
        if (pages.length < 10) {
          pages = document.querySelectorAll('.storybook .spread-container');
        }
        
        return pages;
      };

      /**
       * Extracts image and text content from a page element.
       * Creates an object with the page data and a validation method.
       * 
       * @function extractPageData
       * @param {Element} page - The page element to extract data from
       * @returns {Object} Object containing imageSrc, text, and hasValidContent method
       * @returns {string|null} returns.imageSrc - Source URL of the page image
       * @returns {string|null} returns.text - Text content of the page
       * @returns {Function} returns.hasValidContent - Method to check if page has valid content
       * 
       * @example
       * const pageData = extractPageData(pageElement);
       * if (pageData.hasValidContent()) {
       *   console.log('Page has both image and text');
       * }
       */
      const extractPageData = (page) => {
        const imageSrc = page.querySelector('div.main img')?.src;
        const text = page.querySelector('div.main p')?.textContent;
        
        return {
          imageSrc,
          text,
          hasValidContent: () => imageSrc && text
        };
      };

      /**
       * Creates a page container with formatted content.
       * Builds a page container div with image and/or text content.
       * 
       * @function createPageContainer
       * @param {Object} pageData - The extracted page data object
       * @param {string|null} pageData.imageSrc - Source URL of the page image
       * @param {string|null} pageData.text - Text content of the page
       * @returns {HTMLDivElement} The formatted page container element
       * 
       * @example
       * const pageContainer = createPageContainer({
       *   imageSrc: "image.jpg",
       *   text: "Page content"
       * });
       */
      const createPageContainer = (pageData) => {
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('page-container');
        
        if (pageData.imageSrc) {
          const image = document.createElement('img');
          image.src = pageData.imageSrc;
          pageContainer.appendChild(image);
        }
        
        if (pageData.text) {
          const paragraph = document.createElement('p');
          paragraph.textContent = pageData.text;
          pageContainer.appendChild(paragraph);
        }
        
        return pageContainer;
      };

      /**
       * Applies drop case styling to the first content page.
       * Adds a special CSS class for decorative first letter styling.
       * 
       * @function applyDropCaseStyling
       * @param {HTMLBodyElement} body - The body element to search for content pages
       * @returns {void}
       * 
       * @example
       * applyDropCaseStyling(document.body);
       */
      const applyDropCaseStyling = (body) => {
        const firstContentPage = body.querySelector('.page-container:not(.cover-container)');
        if (firstContentPage) {
          firstContentPage.classList.add('drop-case');
        }
      };

      createStorybookPDF();
    }
  });
});