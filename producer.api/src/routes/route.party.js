var q = 'parties';

// COMMENTS ROTING ------------------------------------------
var create = function (router, mq) {
    router.route('/parties')

    	// create a party (accessed at POST /api/common/party)
        .post(function (req, res) {
            mq.assertQueue(q);
            mq.sendToQueue(q, new Buffer(JSON.stringify(req.body)));
            res.sendStatus(200);
        });
};

module.exports = create; 