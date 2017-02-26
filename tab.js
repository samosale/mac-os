var db = chrome.storage.local;
var notificationCenter = document.getElementsByTagName('notification-center')[0];

chrome.system.memory.getInfo(function callback(data) {
    console.log(data);
})

document.body.addEventListener('mousedown', function (e) {
    if (e.target && e.target.matches("article div.truncate")) {
        notificationCenter.classList.toggle('translate-sidebar');
    }
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        openWeatherMapAPI = "https://api.openweathermap.org/data/2.5/weather?lat=" +
            position.coords.latitude + "&lon=" +
            position.coords.longitude +
            "&units=imperial&appid=ca6ff81b256ad199b3de759c58de182b";
        //only calls API if geolocation is enabled
        //fetchWeather(openWeatherMapAPI); 
    });
}

function setTime() {
    var d = new Date();
    var n = d.getDate();
    document.querySelector('.number').textContent = n;
    var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    var day = d.getDay();
    document.querySelector('.day').textContent = week[day];
    var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var m = d.getMonth();
    document.querySelector('.month').textContent = mL[m];

}
setTime();

function renderNote(content) {
    var note = document.createElement('div');
    note.textContent = content;
    var close = document.createElement('delete');
    close.classList.add('delete-note');
    note.appendChild(close);
    note.classList.add('truncate');
    document.querySelector('.content').appendChild(note);
}

function notesExists(items) {
    return items && items.notes && items.notes.length;
}

function deleteNote(el) {

    var parent = el.parentElement;
    var grandParent = parent.parentElement;
    grandParent.removeChild(parent);

    db.get('notes', function (storage) {


        var storageNotes = storage.notes;

        var index = storageNotes.findIndex(function (note, idx) {
            return note.content === parent.textContent;
        });

        storageNotes.splice(index, 1);

        db.set({
            'notes': storageNotes
        }, function (e) {});

    });
}

function saveNote(note) {
    db.get('notes', function (storage) {

        if (!notesExists(storage)) {

            db.set({
                'notes': [{
                    'content': note
                    }]
            }, function (e) {});

        } else {
            var storageNotes = storage.notes;

            storageNotes.push({
                'content': note
            });

            db.set({
                'notes': storageNotes
            }, function (e) {});
        }

    });
}

db.get('notes', function (items) {

    if (notesExists(items)) {
        items.notes.forEach(function (note) {
            renderNote(note.content);
        });
    }
});

document.getElementById('note-input').addEventListener('keydown', function (e) {
    var key = e.which;
    if (key == 13) {
        var note = this.value;
        renderNote(note);

        saveNote(note);

        this.value = '';
    }
});
//Calculator
'use strict'

var CalculatorOSX = (function () {
    // Variables
    var $keyboard = document.querySelector('.keyboard'),
        $display = document.querySelector('.display'),
        numbers = ['', ''],
        index = 0,
        operator = '';


    document.body.addEventListener('mousedown', function (e) {
        if (e.target && e.target.matches(".key")) {
            var key = e.target.textContent;

            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(key) !== -1) {
                number(key);
            } else if (['÷', '×', '−', '+'].indexOf(key) !== -1) {
                operation(key);
            } else if (key === '=') {
                equal();
            } else if (key === 'AC') {
                clearAll();
            } else if (key === '+/−') {
                invertSign();
            } else if (key === '%') {
                percent();
            } else {
                dot();
            }

            render();
        }
    })

    function render() {
        var latest = numbers[1] || numbers[0];
        $display.textContent = latest;
    }

    function number(n) {
        // Limit the number length
        if (numbers[index].length >= 7) {
            return;
        }

        numbers[index] += n;
    }

    function operation(op) {
        // There is a first number but not an operator? Great, store it.
        if (numbers[0] && !operator) {
            operator = op;
            index = 1;
        }
        // There is a first number, an operator, but not a second number? Just update the operator.
        else if (numbers[0] && operator && !numbers[1]) {
            operator = op;
        }
        // There is a first number, an operator and a second number. Better calculate the result and treat it as a starting point for the next operation.
        else if (numbers[0] && operator && numbers[1]) {
            equal(op);
        }
    }

    function equal(op) {
        if (numbers[0] && operator && numbers[1]) {
            numbers[0] = evaluateExpression(numbers[0], operator, numbers[1]);
            operator = op || '';
            numbers[1] = '';
            if (!op) {
                index = 0;
            }
        }
    }

    function evaluateExpression(n1, op, n2) {
        switch (op) {
            case '÷':
                return (parseFloat(n1) / parseFloat(n2)).toString();
            case '×':
                return (parseFloat(n1) * parseFloat(n2)).toString();
            case '−':
                return (parseFloat(n1) - parseFloat(n2)).toString();
            case '+':
                return (parseFloat(n1) + parseFloat(n2)).toString();
            default:
                throw new Error('Unexpected operator "' + op + '"');
        }
    }

    function clearAll() {
        numbers = ['', ''];
        index = 0;
        operator = '';
    }

    function invertSign() {
        if (numbers[index]) {
            if (numbers[index].charAt(0) === '-') {
                numbers[index] = numbers[index].substring(1);
            } else {
                numbers[index] = '-' + numbers[index];
            }
        }
    }

    function percent() {
        if (numbers[index]) {
            var temp = (parseFloat(numbers[index]) / 100).toString();
            numbers[index] = temp.substring(0, 8);
        }
    }

    function dot() {
        if (numbers[index] && numbers[index].indexOf('.') === -1) {
            numbers[index] += '.';
        }
    }
})();
document.body.addEventListener('mousedown', function (e) {
    if (e.target && e.target.matches("header ul li")) {
        if (document.querySelector(".visible") && document.querySelector(".selected")) {
            document.querySelector(".visible").classList.remove("visible");
            e.target.querySelector('div.submenu').classList.add('visible');
            Array.from(document.querySelectorAll(".selected")).forEach(function (v) {
                v.classList.remove("selected")
            });
            e.target.classList.add('selected');
        }

        e.target.querySelector('div.submenu').classList.add('visible');
        e.target.classList.add('selected');

    }
    if (e.target && !e.target.matches("header ul li")) {
        if (document.querySelector(".visible") && document.querySelector(".selected")) {

            document.querySelector(".selected").classList.remove("selected");
            document.querySelector(".visible").classList.remove("visible");
        }
    }
    if (e.target && e.target.matches(".delete-note")) {
        e.stopPropagation();
        deleteNote(e.target);
    }
})



var audioContext = new AudioContext();
var audio = document.getElementsByTagName('audio')[0];

var source = audioContext.createMediaElementSource(audio);
var analyser = audioContext.createAnalyser();

source.connect(analyser);
analyser.connect(audioContext.destination);

var bufferLength = analyser.frequencyBinCount;
var frequencyData = new Uint8Array(bufferLength);

var svg = document.getElementsByClassName('rects')[0];
let counter = 0;
for (var i = 0; i < 700; i++) {

    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", counter);
    rect.setAttribute("y", "400");

    counter = counter + 9.16;
    svg.appendChild(rect);
}

var rects = document.getElementsByTagName('rect');
var len = rects.length;

var counterRects = 0;

function Render() {
    analyser.getByteFrequencyData(frequencyData);

    if (counterRects < 700) {

        var num = 0;
        for (var i = 0; i < 1024; i++) {
            num += frequencyData[i];
        }

        var player = rects[counterRects].animate([
            {
                transform: 'scaleY(0)'
           },
            {
                transform: `scaleY(${(num/1024)*3})`
           }
   ], {
            duration: 800,
            iterations: 1,
            easing: 'ease-out',
            delay: 0,
            fill: 'forwards'
        });
        counter = counter + 8.16;
        counterRects++;
    } else if (counterRects === 700) {

        svg.classList.remove('move');
        counterRects++;

    } else {

        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        var secCounter = 0;
        for (var k = 0; k < 700; k++) {

            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

            rect.setAttribute("x", secCounter);
            rect.setAttribute("y", "400");
            rect.style.transform = "scale(0)";
            secCounter = secCounter + 9.16;
            svg.appendChild(rect);
        }

        svg.classList.add('move');
        counterRects = 0;
    }

    call = requestAnimationFrame(Render);
}

var isPlaying = false;
var controls = document.getElementById('Controls');

controls.addEventListener('click', function () {
    isPlaying = !isPlaying;

    if (isPlaying) {
        controls.textContent = "Pause";
        controls.style.background = "#F44336";
        svg.classList.add('move');
        audio.play();
        Render();
    } else {
        controls.textContent = "Play";
        controls.style.background = "#4CAF50";
        audio.pause();
        cancelAnimationFrame(call);
    }
});

var request = new XMLHttpRequest();

request.open('GET', '/music/1969995699_1130340345_238716527.mp3', true);
request.responseType = 'blob';

request.onload = function () {
    audio.src = window.URL.createObjectURL(request.response);
    console.log(request.response);
}

request.send();
