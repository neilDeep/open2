angular.module('authentication-module', ['firebase', 'base64'])
  .controller('loginCtrl', function($scope, Services, $state, $firebaseAuth) {
      $scope.ref = new Firebase("https://fiery-inferno-8987.firebaseio.com");
      $scope.authObj = $firebaseAuth($scope.ref);

      $scope.redirectSignup = function() {
        $state.go('signup');
      };
      $scope.submit = function() {
        var user = {
          username: $scope.username,
          password: $scope.password
      };

        //remember the current username to use later
        localStorage.setItem('username', $scope.username);

        //login the user
        Services.login(user)
        .then(function(resp){
          console.log(resp);
           if(resp.data.token) {
             $scope.ref.authWithCustomToken(resp.data.token, function(error, authData){
               if(error) {
                 throw error
               } else {
                 console.log(authData);
                 $state.go('dashboard');
               }
             })
           } else {
             state.go('home');
           }
        });
      };
  })
  .controller('signupCtrl', function($scope, Services, $state, $base64) {

      $scope.submit = function() {
        var pic = $base64.encode($scope.pic);
        var user = {
          username: $scope.username,
          password: $scope.password,
          pic: pic
        };
        Services.signup(user)
        .then(function(resp){
          if(resp.data.token) {
            $scope.ref.authWithCustomToken(resp.data.token, function(error, authData){
             if(error) {
               throw error
             } else {
               $state.go('home');
             }
            })
          } else {
            $state.go('home');
          }
        });
      };
  });
