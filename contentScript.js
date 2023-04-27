chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'takeScreenshot') {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL();
        sendResponse(dataURL);
      };
      img.src = message.tabImage;
      return true;
    }
  });