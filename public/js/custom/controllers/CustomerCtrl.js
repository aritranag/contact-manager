app.controller('CustomerCtrl',["$scope","$state","ApiService","Upload",function($scope,$state,ApiService,Upload){

    /*  ==================== SCOPE VARIABLES =============================== */
    $scope.openOrders = [];
    $scope.order = {
        name : '',
        quantity : 0,
        document : '',
        expected_date : '',
        comments : ''
    };

    /*  ==================== OPERATING CODE =============================== */
    checkAuth();
    getOpenOrders();
    
    /*  ==================== SCOPE FUNCTIONS =============================== */


    // creating a new order
    $scope.createNewOrder = function(){
        var flag = checkNewOrderParams(); // to do

        if(flag){
            // get the form data
            var data = {
                document : $scope.order.document,
                customerId : localStorage.getItem('customerId'),
                order_name : $scope.order.name,
                description : {
                    quantity : $scope.order.quantity,
                    expected_date : $scope.order.expectedDate,
                    comments : $scope.order.comments
                }
            }
            
            // use ng-file-upload to upload it to our server
            Upload.upload({
                url: '/order/new',
                data : data
            }).then(function(res){
                console.log("response data");
                $scope.order = resetOrder();
                getOpenOrders();
            },function(err){
                console.log(err);
            });
        }
    }

    //logout function specific to customer; deletes the customerId and redirects to login page
    $scope.logout = function(){
        localStorage.setItem('customerId','');
        $state.transitionTo('index.login');
    }

    /*  ==================== AUTH FUNCTION =============================== */
    function checkAuth(){
        console.log(localStorage.getItem('customerId'));
        if(!localStorage.getItem('customerId')){
            $state.transitionTo('index.login');
        }
        else{
            console.log("verified customer");
        }
    }

    /*  ==================== API CALLS =============================== */
    // get open orders for a specific customer
    function getOpenOrders(){
        var queryParam = {
            customerId : localStorage.getItem('customerId')
        };

        ApiService.getDataWithParams('/customer/orders/open',queryParam,function(res){
            $scope.openOrders = processOpenOrders(res.data);
        },function(err){
            console.log(err);
        })
    }

    /*  ==================== OTHER FUNCTIONS =============================== */
    // process open orders for a customer
    function processOpenOrders(orderArr){
        return orderArr;
    }

    // check whether user has supplied all required params or not
    function checkNewOrderParams(){
        return true;
    }


    // resets all fields of the order in event of a successful order creation
    function resetOrder(){

        var obj = {
            name : '',
            quantity : 0,
            document : '',
            expected_date : '',
            comments : ''
        };

        return obj;
    }

}]);