

chrome.contextMenus.removeAll();


chrome.contextMenus.create({
    title: "Shitpost Smart Cache link",
    id: "smartcachelink",
    contexts: ["link"]
});


chrome.contextMenus.create({
    title: "Shitpost Smart Cache page",
    id: "smartcachepage",
    contexts: ["page"]
});

chrome.contextMenus.create({
      title: "Shitpost Image (cache)",
      id: "image",
      contexts: ["image"]
});

chrome.contextMenus.create({
    title: "Shitpost Video (cache)",
    id: "video",
    contexts: ["video"]
});

chrome.contextMenus.create( {
    title: "Shitpost This Page w/ Preview",
    id: "preview",
    contexts: ["page"]
});

chrome.contextMenus.create( {
    title: "Shitpost Link w/ Preview",
    id: "link",
    contexts: ["link"]
});

chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
async function genericOnClick(info) {
    console.dir(info);

  switch (info.menuItemId) {
    case "preview": {
        console.log("would shitpost preview " + info.pageUrl)
        await doShitpostPreview(info.pageUrl);
        break;
    }
    case "smartcachelink": {
        console.dir(info);
        const url = info.linkUrl;
        await doShitpostSmartCache(url);
        break;
    }
    case "smartcachepage": {
        console.dir(info);
        const url = info.pageUrl;
        await doShitpostSmartCache(url);
        break;
    }
    case "image": {
        console.dir(info);
        const url = info.srcUrl;
        await doShitpostCache(url);
        break;
    }
    case "video": {
        console.dir(info);
        const url = info.srcUrl;
        await doShitpostCache(url);
        break;
    }
    case "link":{
        console.dir(info);
        const url = info.linkUrl;
        await doShitpostPreview(url);
        break;
    }
  }
}

async function getApiKey() {
    const info = await chrome.storage.local.get({ apikey: ""})

    if (info.apikey == "")
    {
        console.log("No api key");
        return false;
    }
    else {
        return info.apikey;
    }

}

async function doShitpostPreview(url){
    
    var apikey = await getApiKey();
    console.log("apikey from storage " + apikey)

    if(apikey) {
        const callUrl = "https://api.shitpost.sh/" + apikey + "/preview/" + url;
        console.log(url)

        const response = await fetch(callUrl);
        if (response.ok)
        {
            const txt = await response.text();
            console.log(txt);
            await addToClipboard(txt);

        }

    }
    
}

async function doShitpostCache(url){
    var apikey = await getApiKey();
    if (apikey)
    {
        var callUrl = "https://api.shitpost.sh/" + apikey + "/cache/" + url;

        const response = await fetch(callUrl);
        if (response.ok)
        {
            const txt = await response.text();
            console.log(txt);
            await addToClipboard(txt);
        }

    }
}


async function doShitpostSmartCache(url){
    var apikey = await getApiKey();
    if (apikey)
    {
        var callUrl = "https://api.shitpost.sh/" + apikey + "/smartcache/" + url;

        const response = await fetch(callUrl);
        if (response.ok)
        {
            const txt = await response.text();
            console.log(txt);
            await addToClipboard(txt);
        }

    }
}





async function addToClipboard(value) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: 'Write text to the clipboard.'
    });
  
    // Now that we have an offscreen document, we can dispatch the
    // message.
    chrome.runtime.sendMessage({
      type: 'copy-data-to-clipboard',
      target: 'offscreen-doc',
      data: value
    });
    await copySuccess();
  }


  async function copySuccess(){
  let options = {
    type: 'basic',
    title: 'Clipboard updated',
    message: 'Shitpost link now in clipboard',
    iconUrl: 'images/poop-16x16.png'
  };
  chrome.notifications.create(options);
}