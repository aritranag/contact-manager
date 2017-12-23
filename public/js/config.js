
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/index/customer");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.customer', {
            url: "/customer",
            templateUrl: "views/customer.html",
            data: { pageTitle: 'Customer' }
        })
        .state('index.vendor', {
            url: "/vendor",
            templateUrl: "views/vendor.html",
            data: { pageTitle: 'Vendor' }
        })
        .state('index.login',{
            url : '/login',
            templateUrl : "views/login.html",
            data: { pageTitle : 'Login'}
        })
        .state('index.register',{
            url : '/register',
            templateUrl : 'views/register.html',
            data : { pageTitle : 'Register'}
        })
}
angular
    .module('mainapp')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
