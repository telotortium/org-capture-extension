///////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2015-2017 Konstantin Kliakhandler				 //
// 										 //
// Permission is hereby granted, free of charge, to any person obtaining a copy	 //
// of this software and associated documentation files (the "Software"), to deal //
// in the Software without restriction, including without limitation the rights	 //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell	 //
// copies of the Software, and to permit persons to whom the Software is	 //
// furnished to do so, subject to the following conditions:			 //
// 										 //
// The above copyright notice and this permission notice shall be included in	 //
// all copies or substantial portions of the Software.				 //
// 										 //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR	 //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,	 //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE	 //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER	 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN	 //
// THE SOFTWARE.								 //
///////////////////////////////////////////////////////////////////////////////////


chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.storage.local.set({
        nativeEnabled: false,
        emacsclientLocation: 'emacsclient',
    })
    chrome.storage.sync.set(
      {
        selectedTemplate: 'p',
        unselectedTemplate: 'L',
        useNewStyleLinks: true,
        debug: false,
        overlay: true
      });
  } else if ((details.reason == "update" && details.previousVersion.startsWith("0.1"))) {
    chrome.storage.local.set({
        nativeEnabled: false,
        emacsclientLocation: 'emacsclient',
    })
    chrome.storage.sync.set(
      {
        selectedTemplate: 'p',
        unselectedTemplate: 'L',
        useNewStyleLinks: false,
        debug: false,
        overlay: true
      });
  }
});

chrome.runtime.onMessage.addListener(function(message, _, _respond) {
  if (message.command === 'captureWithNativeHost') {
    console.log("Calling native messaging host");
    chrome.runtime.sendNativeMessage(
      "io.github.sprig.org_capture_extension",
      {"uri": message.uri, "emacsclientLocation": message.emacsclientLocation},
    function (response) {
      if (response === null || response === undefined) {
        if (chrome.runtime.lastError) {
          console.log("Native messaging host error: " + chrome.runtime.lastError.message);
          return;
        }
      }
    })
  } else {
    console.log(`Invalid command ${message.command}`);
  }
})

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript({file: "capture.js"});
});
