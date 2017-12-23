app.controller('RegisterCtrl',["$scope","$state","ApiService",function($scope,$state,ApiService){

    /*  ==================== SCOPE VALUES =============================== */
    $scope.tabHeadingNumber = 1;
    $scope.showError = {
        customer : false,
        vendor : false
    };
    $scope.errorMsg = {
        customer : false,
        vendor : false
    };

    
    $scope.customer = {
        name : '',
        email : '',
        password : '',
        confirm_password : ''
    };
    $scope.vendor = {
        name : '',
        email : '',
        password : '',
        confirm_password : ''
    };

    /*  ==================== SCOPE FUNCTIONS =============================== */

    $scope.register = function(type){
        $scope.showError.customer = $scope.showError.vendor = false;
        var flag = checkAuth(type);
    
        if(type == 'customer' && flag){
            var data = {
                name : $scope.customer.name,
                username : $scope.customer.email,
                password : $scope.customer.password,
                email : $scope.customer.email
            };

            // call ApiService for login
            ApiService.postData('/customer/register',data,function(res){
                var data = res.data;
                localStorage.setItem('customerId',data.customerId);
                $state.transitionTo('index.customer');
            },function(err){
                console.log(err);
                $scope.showError.customer = true;
                $scope.errorMsg.customer = err.data;
            })
        }
        else if(type == 'vendor' && flag){
            var data = {
                name : $scope.vendor.name,
                username : $scope.vendor.email,
                password : $scope.vendor.password,
                email : $scope.vendor.email
            };

            // call ApiService for login
            ApiService.postData('/vendor/register',data,function(res){
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
    $scope.goToLogin = function(){
        $state.transitionTo('index.login');
    }

    /*  ==================== OTHER FUNCTIONS =============================== */
    function checkAuth(type){
        if(!$scope[type].email || !$scope[type].password || !$scope[type].name || !$scope[type].confirm_password){
            $scope.showError[type] = true;
            $scope.errorMsg[type] = "All the fields are mandatory";
            return false;
        }
        else if($scope[type].password != $scope[type].confirm_password){
            $scope.showError[type] = true;
            $scope.errorMsg[type] = "Both passwords should be same";
            return false;
        }
        return true;
    }
}])