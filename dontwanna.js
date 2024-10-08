
const launchObserver = (fiends,fiendNames) => {
    const observer = new MutationObserver((mutations) => {
        filterFiends(fiends, 'a.user', 'div.event')
        filterFiends(fiends, 'a.author', 'div.comment');
        filterChallenges(fiends, 'a', 'div.segment','div');
        filterFiendsByName(fiendNames);
    });
    observer.observe(document, { childList: true, subtree: true, childList: true });
};


let fiendsInfos = getFiendsList();

const init = (fiends, fiendNames) => {
    filterFiends(fiends, 'a.user', 'div.event',true)
    filterFiends(fiends, 'a.author', 'div.comment');
    filterFiendsByName(fiendNames)
    filterChallenges(fiends, 'a', 'div.segment','div');
    launchObserver(fiends, fiendNames);
};

function getFiendsList() {
    chrome.storage.sync.get('adaFiends', (result) => {
        if (result && result.adaFiends !== undefined) {
            let fiendsInfos = JSON.parse(result.adaFiends);
            let fiendIds = [];
            let fiendNames = [];
            fiendsInfos.forEach(x => {
                let fiendInfo = x.split(';')
                let id = parseInt(fiendInfo[0]);
                if(!isNaN(id)){
                    fiendIds.push(id);
                }
                if(fiendInfo.length > 1){
                    fiendNames.push(fiendInfo[1]);
                }
              });

            init(fiendIds,fiendNames);
        }
    });
}

function filterFiends(fiends, elemToFind, elemToHide,checkName) {
    const elementList = content.querySelectorAll(elemToFind)
    elementList
        .forEach((x) => {
            let hrefElements = x.href.split('/');
            if (hrefElements.length > 1) {
                let idStr = hrefElements[hrefElements.length - 2];
                let id = parseInt(idStr);
                if (!isNaN(id)) {
                    if (fiends.includes(id)) {
                        let parentDiv = x.closest(elemToHide);
                        if (parentDiv &&  parentDiv.style.display === 'none') {
                            if(checkName){
                                let authorsName = x.innerHTML;
                                if(authorsName !== '' && !fiendNames.includes(authorsName)){
                                    fiendsInfos.push(`${id};${authorsName}`);
                                    chrome.storage.sync.set({ "adaFiends": JSON.stringify(fiendsInfos) });
                                }
                            }
                            parentDiv.style.display = 'none';
                        }
                    }
                }
            }
        });
}


function filterFiendsByName(fiends) {
    if (fiends === null) return;
    const elementList = content.querySelectorAll('div.meta');
    elementList
        .forEach((x) => {
            if (fiends.includes(x.innerHTML)) {
                let parentDiv = x.closest('div.card');
                if (parentDiv) {
                    parentDiv.style.display = 'none';
                }
            }
        });
}

function filterChallenges(fiends, elemToFind, childOfElementTohide, elemToHide) {
    if (window.location.pathname !== '/defis') return;
    const elementList = content.querySelectorAll(elemToFind)
    elementList
        .forEach((x) => {
            let hrefElements = x.href.split('/');
            if (hrefElements.length > 1) {
                let entityType = hrefElements[hrefElements.length - 3];
                if (entityType === 'author') {
                    let idStr = hrefElements[hrefElements.length - 2];
                    let id = parseInt(idStr);
                    if (!isNaN(id)) {
                        if (fiends.includes(id)) {
                            let childOfParent = x.closest(childOfElementTohide);
                            if (childOfParent) {
                                let parentDiv = childOfParent.parentNode.closest(elemToHide);
                                if (parentDiv) {
                                    parentDiv.style.display = 'none';
                                }
                            }
                        }
                    }
                }
            }
        });
}


