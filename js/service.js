var app = angular.module("myServiceModule", []);

app.service("userService", function($http,$q){
	// 使用 promise 对象与 controller 交互
	function promiseObj(url) {
		var deferred = $q.defer();
		var promise = $http.get(url);
		promise.then(function(data){
			deferred.resolve(data.data);
		}, function(error){
			deferred.reject(error);
		});

		return deferred.promise;
	}
	return {
		searchAll:function(){
			return promiseObj("data/allusers.json");
		},
		add : function(user){},
		update : function(user){},
		delete : function(user){},
		searchById : function(id){
			var url = "data/user" + id + ".json";
			return promiseObj(url);
		}
	}
});