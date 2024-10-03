'use strict';

const version = 'v 1.0';


const ptrToFiends = document.getElementById('adaFiends');
if(ptrToFiends){
  chrome.storage.sync.get('adaFiends', (result) => {
    if (result && result.adaFiends !== undefined) {
      const storedFiends = JSON.parse(result.adaFiends);
      if (storedFiends && storedFiends.length > 0){
        ptrToFiends.value  = storedFiends.join('\n');
      }else{
        ptrToFiends.value  = '';
      }
    }
  });
}

document.querySelector('#cancelPopUp').addEventListener('click', () => {
  window.close();
});


const closeElement = document.querySelector("#closePopUp");
if (closeElement) {
  closeElement.addEventListener('click', function () {
    //--------------------------
    // saving fiends list
    //--------------------------
    if(ptrToFiends){
      let fiendsToSaveText = ptrToFiends.value.replace('"', "'").replace("'", "\'");
      let fiendsToSaveArr = fiendsToSaveText.split('\n');
      let fiendsToSave = [];
      fiendsToSaveArr.forEach(x => {
        let fiendInfo = x.split(';')
        let id = parseInt(fiendInfo[0]);
        if(!isNaN(id)){
          fiendsToSave.push(x)
        }
      });
      chrome.storage.sync.set({ "adaFiends": JSON.stringify(fiendsToSave)  });
   }

    //--------------------------
    // closing the window
    //--------------------------
      setTimeout(function () {
        window.close();
      }, 300)
  });
}
