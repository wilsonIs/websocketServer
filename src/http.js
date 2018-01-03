const rp = require('request-promise');

let options = {
	uri:'****/api/',
	qs:{
		token:'*****'
	},
    headers:{
        'Content-Type':'application/x-www-form-urlendcoded'
    },
    json:true
}


function rpRequest(exOption) {
	reqOptions = Object.assign(options,exOption);

	return new Promise(function(resolve,reject){
		let rp = rp(reqOptions).then(function(res){
			resolve(res);
		}).catch(function(rej){
			reject(rej);
		});
	})
}

module.exports = {
    rpRequest
};

