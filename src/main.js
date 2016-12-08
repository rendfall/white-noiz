import Typewriter from './modules/typewriter';
import Request from './modules/request';
import { AudioElement, ImageElement, TextElement } from './elements/all';

(function () {
    let $content = document.getElementById('content');
    let $riddle = document.getElementById('riddle');

    function setupTypewriter() {
        let typewriter = new Typewriter();
        typewriter.render($content);

        typewriter.on('enter', (payload) => {
            validateAnswer(payload.value, (url) => {
                if (url) {
                    alert('Congratulation!');
                } else {
                    alert('Bad answer. Try again.');
                }
            });
        });
    }

    function loadRiddle(data) {
        let { image, content, background, music, ambience } = data;

        setupImage(image);
        setupText(content);
        setupBackground(background);
        setupMusic(music);
        setupAmbience(ambience);
    }

    function setupImage(src) {
        let image = new ImageElement(src);
        image.render($riddle);
    }

    function setupText(content) {
        let text = new TextElement(content);
        text.render($riddle);
    }

    function setupBackground(url) {
        $content.style.background = `#333 url("${url}") repeat 0 0`;
    }

    function setupMusic(src) {
        let music = new AudioElement(src);

        music.setVolume(1.0);
        music.play();
        music.render($riddle);
    }

    function setupAmbience(src) {
        let ambience = new AudioElement(src);

        ambience.setVolume(0.5);
        ambience.play();
        ambience.render($riddle);
    }

    function validateAnswer(text, callback) {
        let method = 'POST';
        let data = {
            riddle: 0,
            ts: Date.now(),
            answer: text
        };
        let request = new Request('http://whitenoize.pl/zest/', { method, data });

        request.on('success', (response) => callback(response.url));
        request.on('error', (error) => { console.log(error) });
        request.send();
    }

    function setupRiddle() {
        let request = new Request('http://whitenoize.pl/zest/');
        request.on('success', (response) => loadRiddle(response));
        request.on('error', (error) => { console.log(error) });
        request.send();
    }

    window.addEventListener('load', () => {
        setupTypewriter();
        setupRiddle();
    });
})();