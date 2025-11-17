chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      function createDocument(title, cover, pages) {
        const w = window.open('', '_blank');
        const doc = w.document;

        doc.open();
        let texts = {}
        let srcs = {}
        let htmlText = ''
        for (const p of pages) {
          const src = p.querySelector('img')?.src;
          const text = p.querySelector('p')?.textContent;
          if (text && src && !srcs[src] && !texts[text]) {
            texts[text] = true;
            srcs[src] = true;
            htmlText += `
              <div class="print-container">
                <div class="print-image"><img src="${src}"></div>
                <div class="print-text">${text}</div>
              </div>`
          }
        }
        const html = `
          <html>
          <head>
            <style>
              @page {
                margin: 0;
                padding: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
              }
              body {
                margin:0;
                padding: 0;
                font: 22pt serif;
                counter-reset: imgCounter; 
              }
              .print-container {
                display: block;
                width: calc(100% - 64px);
                padding: 16px;
                margin: 16px auto;
                page-break-before: always;
              }
              .print-image {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              .print-image img {
                max-width: 60%;
                object-fit: contain;
                border-radius: 2rem;
                clip-path: inset(0 0 68px 0 round 2rem);
              }
              .print-text {
                width: calc(100% - 64pt);
                text-align: justify;
                margin: auto;
                padding: 8pt 32pt;
              }
              @media print and (orientation: landscape) {
                .print-container {
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  width: 100vw;
                  height: 100vh;
                  margin: 0px;
                  padding: 0pt;
                  gap: 0;
                }
                .print-image {
                  display: block;
                  width: 100%;
                  padding: 32pt;
                }
                .print-image img {
                  max-width: 100%;
                }
                .print-text {
                  font-size: 28pt;
                  padding:0;
                  margin-right: 32pt;
                }
              }
              h1 {
                text-align: center;
                font-size: 4rem;
              }
            </style>
          </head>

          <body>
            <div class="print-container">
              <h1>${title}</h1>
              <div class="print-image"><img src="${cover}"></div>
            </div>
            ${htmlText}
          </body>
          </html>
        `;
        console.log(html)
        doc.write(html)
        doc.close();
      }
      //let pages = document.querySelectorAll('.page:not([class*="cover"])');
      //if (pages.length < 10)
        //pages = document.querySelectorAll('.storybook .spread-container');
      let cover = document.querySelector('.cover');
      if (cover && cover.querySelector('img'))
        cover = cover.querySelector('img').src
      else
        cover = null
      let pages = document.querySelectorAll('storybook-page');

      if (pages.length < 4) {
        alert('please try on a Gemini StoryBook, e.g. https://gemini.google.com/share/cbd4c3dece1e')
        return;
      }
      const title = document.querySelector('.cover-title')?.textContent || 'Untitled';
      createDocument(title, cover, pages)
      /*const w = window.open('', '_blank');
      const doc = w.document;
      doc.open();
      doc.title = title;
      const body = doc.createElement('body');
      body.style = 'margin:0; padding:0'
      doc.appendChild(body);
      const divStyle = 'padding: 16pt; box-sizing: border-box; font: 22pt serif';
      const div = doc.createElement('div');
      div.style = divStyle;
      body.appendChild(div);
      const style = 'display: flex; justify-content: center; align-items:center; margin: auto; max-width: 80vw; max-height:80vh; display: block; padding: 16pt 0; page-break-before: always;';
      const h2 = doc.createElement('h2');
      h2.style = style + ';text-align:center';
      h2.textContent = title;
      div.appendChild(h2);
      let texts = {}
      let srcs = {}
      for (const p of pages) {
        const src = p.querySelector('img')?.src;
        const text = p.querySelector('p')?.textContent;
        if (text && src && !srcs[src] && !texts[text]) {
          texts[text] = true;
          srcs[src] = true;
          const img = doc.createElement('img');
          img.src = src;
          img.style = style;
          div.appendChild(img);
          const para = doc.createElement('p');
          para.style = style;
          para.textContent = text;
          div.appendChild(para);
        }
      }

      doc.close();*/
    }
  });
});
