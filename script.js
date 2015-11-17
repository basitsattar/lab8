var app = angular.module("myApp", []);
var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(2211027)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
app.controller("myAppController", ['$scope','weatherPlugin',function($scope,weatherPlugin) {
    
    $scope.days = ["Mon","Tue","Wed","Thur","Fri","Sat","Sun"];
    date = (typeof (date) === 'undefined')?new Date():new Date(date); 
    var year = date.getFullYear();
    var month = date.getMonth();
    var dateNow = (new Date());
    var monthName = monthNames[month];
    var day = date.getDate();
    var dayInMon = (new Date(year, month + 1, 0)).getDate();
    var minusDate = 0;
    var weekIndex = 0;
    var monthStartDay = new Date(year,month, 1).getDay();  
    $scope.currMonth = monthName + ", " + year.toString();
    $scope.dateNow = dateNow;
    $scope.weeks = new Array([],[],[],[],[],[],[]);
    monthStartDay= ( monthStartDay === 0 ) ?  7 : monthStartDay ;
    for(var i=monthStartDay - 1;i>0;i--){
        var preMonDate = new Date(year, month, minusDate--);
        var day = {};
        day.number = preMonDate.getDate();
        day.class = "disabled";
        day.data = day.number + "  ";
        $scope.weeks[weekIndex].push(day);
    }
    $scope.weeks[weekIndex].reverse();
    var weekRemaining = 7-$scope.weeks[0].length;
    if(weekRemaining<1){
        weekIndex++;
        weekRemaining = 7;
    }
    var count = monthStartDay;
    for (var dateIte = 1; dateIte < dayInMon + 1;  dateIte++) {
        var date = new Date(year, month, dateIte);
        var day = {};
        day.number = date.getDate();
        day.weather = ' ';
        day.data = day.number + " " + day.weather;
        if(dateNow.getDate() === date.getDate()){
            day.class = "today";
        }
        var weekRemaining = 7-$scope.weeks[weekIndex].length;
        if(weekRemaining<1){
            weekIndex++; weekRemaining = 7;
        }
        $scope.weeks[weekIndex].push(day);
        count++;
    }
    var count = count;
    var plusDate = 1;
    while (count < 43) {
        var nextMonDate = new Date(year, month + 1, plusDate++);
        var day = {};
        day.number = nextMonDate.getDate();
        day.class = "disabled";
        day.data = day.number + "";
        var weekRemaining = 7-$scope.weeks[weekIndex].length;
        if(weekRemaining<1){
            weekIndex++; weekRemaining = 7;
        }
        $scope.weeks[weekIndex].push(day);
        count++;
    } 
    weatherPlugin.getWeather().then(function(data){
        $scope.weather = data;
        document.getElementsByClassName('today')[0].innerHTML = data.item.condition.temp+" "+data.item.condition.text;});
}]);
 app.factory('weatherPlugin', ['$http', '$q', function ($http, $q){
      function getWeather() {
        var deferred = $q.defer();
        $http.get(query)
        .success(function(data){deferred.resolve(data.query.results.channel);}).
        error(function(err){deferred.reject(err);});
        return deferred.promise;
      }
      return {getWeather: getWeather};
}]);