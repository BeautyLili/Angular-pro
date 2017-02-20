/*控制器模块*/
var app=angular.module("myControllerModule",[]);//新建一个名为myCOntrollerModule模块
app.controller("loginController",function($scope,$http,$cookies,$state){
	$scope.error=false;
	//读取cookie线回收在页面中
	var uname=$cookies.get("username");
	$scope.user={username:uname};
	if(uname){
		$scope.remeber=true;
	}
	$scope.login=function(){
		// console.log("用户登录"+JSON.stringify($scope.user));
		$http.get("data/administrator.json").success(function(data){
			if($scope.user.username===data.username && $scope.user.password===data.password){
				$scope.error=false;
				console.log("登录成功");
				if($scope.remeber){
					var data=new Date();
					data.setDate(data.getDate()+7);
					$cookies.put("username",$scope.user.username,{expires:data});
				}else{
					$cookies.remove("username");
				}
				//视图跳转
				$state.go("main");

			}else{
				$scope.error=true;
			}
		});
	}
});
//查看所有用户
app.controller("allUsersController",["$scope","$http","userService",function($scope,$http,userService){
	$scope.options={
		paginationPageSizes: [10, 20, 30],
   		paginationPageSize: 10,
		columnDefs:[
			{field:"id",name:"编号"},
			{field:"username",name:"用户名"},
			{field:"address",name:"地址"},
			{field:"phone",name:"电话"},
			{name:"操作",cellTemplate:"<div><a ui-sref='userdetail({id:row.entity.id})'>查看详请</a><a ui-sref='modify({id:row.entity.id})'>修改</a><a ng-click='delete()'>删除</a></div>"}
		]
	}
	// 调用 service 方法
	userService.searchAll().then(function(data){
		$scope.options.data = data;
	})

}]);
//增加用户
app.controller("addUsersController",function($scope,$http,userService){
	$scope.gridOpts={
		paginationPageSizes: [10, 20, 30],
   		paginationPageSize: 10,
		columnDefs:[
			{field:"id",name:"编号"},
			{field:"username",name:"用户名"},
			{field:"address",name:"地址"},
			{field:"phone",name:"电话"}
		]
	};
	userService.searchAll().then(function(data){
		$scope.gridOpts.data=data;
	});
	$scope.addData =function(){
		var n =$scope.gridOpts.data.length + 1;
	   		$scope.gridOpts.data.push({
	            "id": n,
	            "username": $scope.user.username,
	            "level": $scope.user.level,
	            "score": $scope.user.score,
	            "address": $scope.user.address,
	            "phone":$scope.user.phone
	        });
	        $scope.user.username="";
	        $scope.user.level="";
	        $scope.user.score="";
	        $scope.user.address="";
	        $scope.user.phone=""
	}

});
//查找用户
app.controller("searchUsersController",function($scope,$http,userService){
	$scope.gridOptions={
		enableFiltering:true,
		onRegisterApi:function(gridApi){
			$scope.gridApi=gridApi;
		},
		columnDefs:[
			{field:"id",name:"编号"},
			{field:"username",name:"用户名"},
			{field:"address",name:"地址"},
			{field:"phone",name:"电话"},
		]
	};
	$http.get("data/allusers.json").success(function(data){
		$scope.gridOptions.data=data;
	});
});
//查看详情
app.controller("userdetail",function($scope,$stateParams,userService){
	var id = $stateParams.id;
	var promise = userService.searchById(id);
	promise.then(function(data){
		$scope.user = data;
	});

});
//修改用户
app.controller("modifyuser",function($scope,$stateParams,userService){
	var id = $stateParams.id;
	var promise = userService.searchById(id);
	promise.then(function(data){
		$scope.user = data;
	});
	$scope.modify=function(){
		var add=$scope.user.address;
		var phone=$scope.user.phone;
		var html=$scope.user.id+" "+$scope.user.username+" "+$scope.user.level+" "+$scope.user.score+" "+$scope.user.address+" "+$scope.user.phone;
		$(".modify").html(html);
		// console.log(add,phone)
	}
});

