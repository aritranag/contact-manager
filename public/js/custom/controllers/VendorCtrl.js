app.controller('VendorCtrl',["$scope","$state","ApiService",function($scope,$state,ApiService){
    
        /*  ==================== SCOPE VARIABLES =============================== */
        $scope.openOrders = [];
        $scope.quotedOrders = [];
        $scope.showOrderUpdateWindow = false;
        $scope.selectedOrder = '';
        $scope.showError = false;
        $scope.activeTab = 1;
    
        /*  ==================== OPERATING CODE =============================== */
        checkAuth();
        getQuotedOrders();
        getOpenOrders();
        
        /*  ==================== SCOPE FUNCTIONS =============================== */

        // shows the bid window with the order selected
        $scope.showBidWindow = function(order){
            $scope.showOrderUpdateWindow = true;
            // set the selected order to what the user has clicked
            $scope.selectedOrder = order;
        }

        // closes the Order update window
        $scope.closeBox = function(){
            $scope.showOrderUpdateWindow = false;
            $scope.selectedOrder = {};
        }

        // order update call
        $scope.submitVendorBid = function(){

            // check whether user has supplied order quote and expected delivery date
            if(checkOrderUpdateParams()){
                
                var data = {};
                data.vendorId = localStorage.getItem('vendorId');
                data.order_quote = $scope.selectedOrder.order_quote;
                data.orderId = $scope.selectedOrder._id;
                data.expected_date = $scope.selectedOrder.expected_date;
                data.comments = $scope.selectedOrder.vendor_comments || '';

                // call ApiService for login
                ApiService.postData('/order/update/workinfo',data,function(res){
                    $scope.selectedOrder = {};
                    getQuotedOrders();
                    getOpenOrders();
                },function(err){
                    console.log(err);
                    $scope.showError = true;
                    $scope.errorMsg = err.data;
                })
            } 
            else{
                $scope.errorMsg = "Invalid Quote or Delivery By date";
                $scope.showError = true;
            }  
        }

        //logout function specific to customer; deletes the customerId and redirects to login page
        $scope.logout = function(){
            localStorage.setItem('vendorId','');
            $state.transitionTo('index.login');
        }
    
        /*  ==================== AUTH FUNCTION =============================== */
        function checkAuth(){
            var vendorId = localStorage.getItem('vendorId');
            if(!vendorId){
                $state.transitionTo('index.login');
            }
            else{
                console.log("verified vendor");
            }
        }
    
        /*  ==================== API CALLS =============================== */
        // get open orders for this vendor
        function getOpenOrders(){
            var queryParam = {
                vendorId : localStorage.getItem('vendorId')
            };
    
            ApiService.getDataWithParams('/vendor/orders/open',queryParam,function(res){
                $scope.openOrders = processOpenOrders(res.data);
            },function(err){
                console.log(err);
            })
        }

        // get quoted orders 
        function getQuotedOrders(){
            var queryParam = {
                vendorId : localStorage.getItem('vendorId')
            };
    
            ApiService.getDataWithParams('/vendor/orders/quoted',queryParam,function(res){
                $scope.quotedOrders = processQuotedOrders(res.data);
            },function(err){
                console.log(err);
            })
        }
    
        /*  ==================== OTHER FUNCTIONS =============================== */
        // process open orders for a customer
        function processOpenOrders(orderArr){
            return orderArr;
        }
    
        // process open orders for a customer
        function processQuotedOrders(orderArr){
            return orderArr;
        }

        // check whether vendor has supplied all required params or not
        function checkOrderUpdateParams(){
            
            if(!$scope.selectedOrder.order_quote || !$scope.selectedOrder.expected_date){
                return false;
            }
            return true;
        }
    
    }]);