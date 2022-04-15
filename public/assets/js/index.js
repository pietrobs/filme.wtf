const gameObject = [
    {
        id: 1,
        image: "https://l3apq3bncl82o596k2d1ydn1-wpengine.netdna-ssl.com/wp-content/uploads/2019/10/JohnWickVRFightScene.jpg",
        correct: 1,
        options: [
            "Matrix Reloaded",
            "John Wick 3",
            "Siberia",
            "Constantine",
            "O Advogado do Diabo",
        ]
    },
    {
        id: 2,
        image: "https://www.cantodosclassicos.com/wp-content/uploads/2016/03/tarantino-video-cima-baixo-tarantino-from-below.jpg",
        correct: 4,
        options: [
            "Kick-Ass",
            "Guerra Mundial Z",
            "O Clube da Luta",
            "A Vida é Bela",
            "Bastardos Inglorios",
        ]
    },
    {
        id: 3,
        image: "https://static.standard.co.uk/s3fs-public/thumbnails/image/2016/03/09/10/baywatchfilm0903a.jpg?width=968",
        correct: 2,
        options: [
            "O Rei do Show",
            "High School Musical 2",
            "Baywatch",
            "Vizinhos",
            "Curta Essa com Zac Efron",
        ]
    }
];

const gameVariables = {
    gameIndex: 0,
    historic: [],
}

function renderGame(index) {
    resetTitle();

    const currentGame = gameObject[index];

    const banner = document.getElementById("banner");
    banner.src = currentGame.image;

    clearOptions();

    for (let i = 0; i < currentGame.options.length; i++) {
        const option = currentGame.options[i];

        renderOption(option, i, currentGame.correct, currentGame.options[currentGame.correct]);
    }
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

        if (isCorrect) {
            li.className += " correct";
            gameVariables.historic.push(true);
        } else {
            li.className += " wrong";
            gameVariables.historic.push(false);
        }

        gameVariables.gameIndex++;

        changeTitle(correctTitle);

        await new Promise(resolve => setTimeout(resolve, 2000));

        if (gameVariables.gameIndex < gameObject.length) {
            renderGame(gameVariables.gameIndex);
        } else {
            renderShare();
        }
    }

    ul.appendChild(li);

    return li;
}

function renderShare() {
    const result = document.getElementById("result");
    const modal = document.getElementById("modal-share");
    const shareBtn = document.getElementById("share");

    modal.style.display = "block";

    const shareString = getShareString();
    result.innerHTML = shareString;

    shareBtn.onclick = () => {

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

function getShareString() {
    var shareString = ""
    var corrects = 0;

    for (let i = 0; i < gameVariables.historic.length; i++) {
        const isCorrect = gameVariables.historic[i];

        shareString += isCorrect ? "🟩" : "🟥";

        if (isCorrect) {
            corrects++;
        }
    }

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


(function () {
    renderGame(gameVariables.gameIndex);
})();