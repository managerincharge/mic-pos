module.exports = function (settings, moment) {
    return {

        moment: moment,

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
        storeId: settings.storeId.split('-')[1],

        // date formats
        DateToStringSeqWithTimeIncFracSecs: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss:SSS');
        },
        
        DateToStringSeqWithTimeIncSecs: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },

        DateToStringSeqWithTimeNoSecs: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm');
        },

        DateToStringSeqNoTime: function (date) {
            return moment(date).format('YYYY-MM-DD');
        },

    };
};
