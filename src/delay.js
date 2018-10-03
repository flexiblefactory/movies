//allow use of await delay ie: await delay(delayDuration);
export const delay = function (duration) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, duration);
    });
};