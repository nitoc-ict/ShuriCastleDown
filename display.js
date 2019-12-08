let story;
let page = "0";
let nameField;
let messageField;

let isFinished = false;

let app;
let stage;

let isButtonChanse = false;
let isButtonPressed = false;

const right = 0;
const left = 0;


window.onload = function() {

    app = new PIXI.Application({
        width: 1000,//1300,
        height: 700,//600,
        view: document.getElementById("myCanvas"),
        backgroundColor: 0xFFFFFF
    });
    stage = new PIXI.Container();
    onLoad(location.search.substring(1).split("=")[1] + ".json");
};

let $text, $textCurrent, $counter;

function onLoad(json) {
    document.getElementById("field").appendChild(app.view);

    (function (handleload) {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', handleload, false);
        xhr.open('GET', json, true);
        xhr.send(null);
    }(function handleLoad (event) {
        let xhr = event.target;
        story = JSON.parse(xhr.responseText)["script"];
        nameField = document.getElementById("name_field");
        messageField = document.getElementById("typing");
    }));
}

function onClick () {
    if (isButtonChanse) {
        if (!isButtonPressed) return;
    }
    if (story[page] === undefined) {
		isFinished = true;
    }
    if (isFinished) {
        setText({
            "name": " ",
            "message": "もどってください"
        });
		finish();
		
        return;
    }

    isButtonChanse = story[page]["change"];

    if (isButtonChanse) {
        setButton(story[page]["root"]);
        // story[page]["rank"]

    }else{
        removeObjects();
        document.body.background = story[page]["background-image"];
        setText(story[page]);
        setObject(story[page]);
    }
    page++;
}

/**
 * 会話が終わったらコールされる
 */
function finish() {
    
	window.location.href = "../index.html";
}

let buttons = [];

function setButton(data) {
    console.log("aaa");
    var size = {
        w: 10,
        h: 10,
    };

    var renderer = PIXI.autoDetectRenderer({
        width: 700,
        height: 400,
        view: document.getElementById("buttons"),
        backgroundColor: 0xFFFFFF
    });

    //document.body.appendChild(renderer.view);

    document.getElementById("select_buttons").appendChild(renderer.view);

    renderer.backgroundColor = 0xFFFFFF;

    let height = 0;
    let i = 0;
    data.forEach(function (value) {
        let button = new PIXI.Text(value["message"], {
            font : '50px Arial',
            fill : 0x000000,
            align : 'center'
        });
        button.width = 700;
        button.height = 60;
        button.anchor.x = 0.5;
        button.anchor.y = 0.5;
        button.position.x = 150;
        button.position.y = 90 + height;
        height += 70;

        stage.addChild(button);

        button.interactive = true;

        button
            .on('click', function () {
                page = "0";
                buttons.forEach(function (button) {
                    button.clear;
                    stage.removeChild(button);
                });
                isButtonPressed = true;
                onLoad(value["name"]);
                onClick();
            })
            .on('touchstart', function () {
                page = "0";
                buttons.forEach(function (button) {
                    stage.removeChild(button);
                });
                isButtonPressed = true;
                onLoad(value["name"]);
                onClick();
            });
        buttons[i] = button;
        renderer.render(stage);
        i++;
    })
}

/**
 * @param data
 */
function setText(data) {
    nameField.innerHTML = data["name"];
    messageField.innerHTML = data["message"];
    $text = messageField.firstChild.nodeValue;
    $textCurrent = messageField.firstChild.nodeValue;
    messageField.innerHTML = '';
    $counter = 0;
    displayOneByOne();
}

function displayOneByOne() {
    let timeout = 250;
    messageField.innerHTML = $text.substr( 0, ++$counter ) + '<br />';
    setTimeout( 'displayOneByOne()', timeout );
}

let objects = [];

function setObject(data) {
    let i;
    for (i = 0; i < data["objects"].length; i++) {
        let object = data["objects"][i];
        let texture = PIXI.Texture.from(object["image"]);
        let image = new PIXI.Sprite(texture);
        image.width = 500;
        image.height = 500;
        if(object["position"] === "right"){
            image.position.x = 200;
            image.position.y = 100;
        }
        else if(object["position"] === "left"){
            image.position.x = -100;
            image.position.y = 100;
        }
        objects[i] = image;
        app.stage.addChild(image);
    }
}

function removeObjects() {
    objects.forEach(function(object) {
        app.stage.removeChild(object);
    });
    objects = [];
}
