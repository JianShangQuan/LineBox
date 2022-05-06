import './css/index.css';
import Icon from './assets/logo-full.png'



(function init(){
    console.log("load assets;");
    document.getElementById('icon').src = Icon;

    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = Icon;
    document.head.appendChild(link);
})();