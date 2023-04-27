// background.js
// chrome.runtime.onInstalled.addListener(() => {
// 	chrome.declarativeNetRequest.updateDynamicRules({
// 		removeRuleIds: [],
// 		addRules: [{
// 			id: 1,
// 			priority: 1,
// 			action: {
// 				type: "modifyHeaders",
// 				responseHeaders: [
// 					{
// 						"header": "Access-Control-Allow-Origin",
// 						"value": "*"
// 					},
// 					{
// 						"header": "Origin",
// 						"value": ""
// 					}
// 				]
// 			},
// 			condition: {
// 				urlFilter: "https://zircon-twisty-can.glitch.me/*"
// 			}
// 		}]
// 	});
// });

chrome.action.onClicked.addListener(async (tab) => {
	// Click on an element in the page
	// Request permission to access resources from https://example.com/
	
	chrome.permissions.request({
		origins: ['https://zircon-twisty-can.glitch.me/*']
	}, function (granted) {
		if (granted) {
			console.log("permission granted")
			chrome.scripting.executeScript({
				// target: { tabId: newTab.id },
				target: { tabId: tab.id },
				function: scrapeInstagramStories,
			});
			console.log("after")
		} else {
			console.log('Permission denied');
		}
	});
	
});


async function scrapeInstagramStories(tab) {
	const elements = document.querySelectorAll('button[aria-label*="Story"]');
	elements[0].click();

	function uploadImg() {
		return new Promise(resolve => setTimeout(() => {
			console.log("AHHH")
			const imgElement = document.querySelector('img[srcset*="https://scontent"]');
			// const link = document.createElement('a');
			// link.href = imgElement.src;
			console.log("inside")
			fetch('https://zircon-twisty-can.glitch.me/uploadToS3', {
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ imageUrl: imgElement.src })
			})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				resolve(data);
			})
			.catch(error => console.error(error));
		// link.download = 'my-image.jpg';
		// link.click();
		}, 2000));
	}

	let nextButton;
	while(true) {
		const res = await uploadImg();
		console.log('after upload', res);
		nextButton = document.querySelector('button[aria-label="Next"]');
		if (!nextButton) {
			break;
		}
		nextButton.click();
	};
}
