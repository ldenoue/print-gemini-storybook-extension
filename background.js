chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const title = document.querySelector('.cover-title')?.textContent || 'Untitled';
      const w = window.open('', '_blank');
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
      const style = 'margin: auto; max-width: 80%; display: block; padding: 16pt 0;';
      const h2 = doc.createElement('h2');
      h2.style = style + ';text-align:center';
      h2.textContent = title;
      div.appendChild(h2);

      let pages = document.querySelectorAll('.page:not([class*="cover"])');
      if (pages.length < 10)
        pages = document.querySelectorAll('.storybook .spread-container');

      for (const p of pages) {
        const src = p.querySelector('img')?.src;
        const text = p.querySelector('p')?.textContent;
        if (src) {
          const img = doc.createElement('img');
          img.src = src;
          img.style = style;
          div.appendChild(img);
        }
        if (text) {
          const para = doc.createElement('p');
          para.style = style;
          para.textContent = text;
          div.appendChild(para);
        }
      }

      doc.close();
    }
  });
});
