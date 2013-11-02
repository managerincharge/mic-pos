module.exports = function (settings) {
    return {

        vernam: {
            enc: function (message, key) {
                var ris = "", len = message.length, m = "", k = "", c;
                for (var i = 0; i < len; i++) {
                    m = message.charCodeAt(i);
                    k = key.charCodeAt(i % key.length);
                    c = m + k;
                    ris += String.fromCharCode(c);
                }
                return ris;
            },
            dec: function (message, key) {
                var ris = "", len = message.length, m = "", k = "", c;
                for (var i = 0; i < len; i++) {
                    m = message.charCodeAt(i);
                    k = key.charCodeAt(i % key.length);
                    c = m - k;
                    ris += String.fromCharCode(c);
                }
                return ris;
            }
        },

        orgId: settings.storeId.split('-')[0],
        storeId: settings.storeId.split('-')[1]

    };
};
