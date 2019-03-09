const w = window;
w.channelPluginSettings = {pluginKey: "8bb07b81-523b-4e1a-87e8-8238cfc228da"};
(function() {
if (w.ChannelIO) {
    return (w.console.error || w.console.log || function(){})('ChannelIO script included twice.');
}
let ch = function() {
    ch.c(arguments);
};
ch.q = [];
ch.c = function(args) {
    ch.q.push(args);
};
w.ChannelIO = ch;
function l() {
    if (w.ChannelIOInitialized) {
    return;
    }
    w.ChannelIOInitialized = true;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
    s.charset = 'UTF-8';
    let x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
}
if (document.readyState === 'complete') {
    l();
} else if (w.attachEvent) {
    w.attachEvent('onload', l);
} else {
    w.addEventListener('DOMContentLoaded', l, false);
    w.addEventListener('load', l, false);
}
})();