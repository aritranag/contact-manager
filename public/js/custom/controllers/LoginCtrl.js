app.controller('LoginCtrl',["$scope","$state","ApiService",function($scope,$state,ApiService){

    /*  ==================== SCOPE VALUES =============================== */
    $scope.tabHeadingNumber = 1;
    $scope.showError = false;
    $scope.errorMsg = "";
    $scope.customer = {
        username : '',
        password : ''
    };
    $scope.vendor = {
        username : '',
        password : ''
    };

    /*  ==================== SCOPE FUNCTIONS =============================== */
    $scope.changeTabHeading = function(num){
        $scope.tabHeadingNumber = num;
    };

    $scope.login = function(type){
        $scope.showError = false;
        var flag = checkAuth(type);
    
        if(type == 'customer' && flag){
            var data = {
                username : $scope.customer.username,
                password : $scope.customer.password
            };

            // call ApiService for login
            ApiService.postData('/customer/login',data,function(res){
                var data = res.data;
                localStorage.setItem('customerId',data.customerId);
                $state.transitionTo('index.customer');
            },function(err){
                console.log(err);
                $scope.showError = true;
                $scope.errorMsg = err.data;
            })
        }
        else if(type == 'vendor' && flag){
            var data = {
                username : $scope.vendor.username,
                password : $scope.vendor.password
            };

            // call ApiService for login
            ApiService.postData('/vendor/login',data,function(res){
                var data = res.data;
                console.log(res.data);
                localStorage.setItem('vendorId',data.vendorId);
                $state.transitionTo('index.vendor');
            },function(err){
                console.log(err);
                $scope.showError = true;
                $scope.errorMsg = err.data;
            });
        }
    }
    $scope.goToRegister = function(){
        $state.transitionTo('index.register');
    }

    /*  ==================== OTHER FUNCTIONS =============================== */
    function checkAuth(type){
        if(!$scope[type].username || !$scope[type].password){
            $scope.showError = true;
            $scope.errorMsg = "Username or password must be given";
            return false;
        }
        return true;
    }
}])