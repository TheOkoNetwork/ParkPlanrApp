const configStore = {
    appName: "*ParkPlanr*",
};

function config(key) {
    if (configStore[key]) {
        return configStore[key];
    } else {
        return false;
    }
}

module.exports = config;
