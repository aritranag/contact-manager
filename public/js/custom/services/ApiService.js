app.service('ApiService',function($http,$location){
    
        var server = $location.host();
        var port = $location.port();
        var protocol = "https";
    
        function postData(url,data,successCallback,errorCallback){
          
            $http.post(url + '/',data).then(function(res){
                successCallback(res);
            },function(err){
                errorCallback(err);
            });
        }
    
        function getData(url,successCallback,errorCallback){
            $http.get(url + '/').then(function(res){
                successCallback(res);
            },function(err){
                errorCallback(err);
            });
    
        }

        function getDataWithParams(url,params,resolve,reject){
            var config = {
                params : params
            };
            $http.get(url + '/',config).then(function(res){
                resolve(res);
            },function(err){
                reject(err);
            })
            
        }
    
        return({
            postData : postData,
            getData  : getData,
            getDataWithParams : getDataWithParams
        });
    });
    