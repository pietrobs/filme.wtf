

const gameVariables = {
    gameIndex: 0,
    imageIndex: 0,
    historic: [],
}

function handleImageClick() {
    const currentGame = getCurrentGame();
    gameVariables.imageIndex++;

    if (gameVariables.imageIndex >= gameObject[gameVariables.gameIndex].images.length) {
        gameVariables.imageIndex = 0;
    }

    renderImage(currentGame.images[gameVariables.imageIndex]);
}

function renderGame() {
    const currentGame = getCurrentGame();
    const clickIndicator = document.getElementById("click-indicator");
    const hack = document.getElementById("hack");

    if (currentGame == null) {
        renderShare();
    }

    resetTitle();

    hack.onclick = () => localStorage.clear();
    clickIndicator.onclick = handleImageClick;


    renderImage(currentGame.images[gameVariables.imageIndex]);

    clearOptions();

    for (let i = 0; i < currentGame.options.length; i++) {
        const option = currentGame.options[i];

        renderOption(option, i, currentGame.correct, currentGame.options[currentGame.correct]);
    }
}

function renderImage(image) {
    const banner = document.getElementById("banner");
    banner.src = image;
}

function clearOptions() {
    const ul = document.getElementById("options");
    ul.innerHTML = "";
}

function renderOption(name, index, correctIndex, correctTitle) {
    const ul = document.getElementById("options");
    const li = document.createElement("li");
    li.className = "option";

    li.innerHTML = name;

    li.onclick = async () => {
        const isCorrect = index === correctIndex;

        // window.analytics.logEvent('select_option', {
        //     isCorrect: isCorrect,
        //     clicked: name,
        //     correct: correctTitle,
        // });

        if (isCorrect) {
            li.className += " correct";
            gameVariables.historic.push(true);
        } else {
            li.className += " wrong";
            gameVariables.historic.push(false);
        }

        storeHistoric();

        changeTitle(correctTitle);

        await new Promise(resolve => setTimeout(resolve, 2000));

        nextRound();

    }

    ul.appendChild(li);

    return li;
}

const now = new Date();
const storageDailyKey = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();

function storeHistoric() {

    localStorage.setItem(storageDailyKey, JSON.stringify(gameVariables.historic));
}

function getHistoric() {
    const historic = localStorage.getItem(storageDailyKey);
    return historic ? JSON.parse(historic) : [];
}

function renderShare() {


    const result = document.getElementById("result");
    const resultStr = document.getElementById("result-str");
    const modal = document.getElementById("modal-share");
    const shareBtn = document.getElementById("share");

    modal.style.display = "flex";

    const shareResult = getShareResult();
    const shareString = getShareString();
    resultStr.innerHTML = shareString;
    result.innerHTML = shareResult;

    // window.analytics.logEvent('render_share', {
    //     result: shareResult,
    //     resultStr: shareString,
    // });

    shareBtn.onclick = () => {

        // window.analytics.logEvent('share', {
        //     result: shareResult,
        //     resultStr: shareString,
        // });

        try {
            if (navigator.share) {
                const shareData = {
                    title: 'filme.wtf',
                    text: shareString,
                    url: 'https://filme.wtf',
                }

                navigator.share(shareData);
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(shareString).then(function () {
                    alert("Copiado para área de transferência!");
                });
            } else {
                copyToClipboard(shareString);
            }
        } catch (err) {
            alert(err);
        }
    }
}

function copyToClipboard(str) {
    var aux = document.createElement("input");
    aux.setAttribute("value", str);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);

    alert("Copiado para área de transferência!");
}

function getShareResult() {
    var result = "";

    for (let i = 0; i < gameVariables.historic.length; i++) {
        const isCorrect = gameVariables.historic[i];

        result += isCorrect ? "🟩" : "🟥";
    }

    return result;
}

function getShareString() {
    var shareString = ""
    var corrects = gameVariables.historic.filter(r => r).length;

    shareString += "\n\n Joguei filme.wtf e acertei " + corrects + " de " + gameVariables.historic.length + " filmes!";
    return shareString;
}

function changeTitle(str) {
    const title = document.getElementById("title");
    title.innerHTML = str;
}

function resetTitle() {
    changeTitle("Que filme é esse?");
}

function getCurrentGame() {
    return gameObject[gameVariables.gameIndex];
}

function nextRound() {
    gameVariables.imageIndex = 0;
    gameVariables.gameIndex++;
    if (gameVariables.gameIndex < gameObject.length) {
        renderGame();
    } else {
        renderShare();
    }

}

function loadInitialVariables() {
    const historic = getHistoric();
    gameVariables.historic = historic;
    gameVariables.gameIndex = historic.length;
}

(function () {
    loadInitialVariables();
    renderGame();
})();